# ThingsBoard设备激活

* HTTP POST `/provision`

递交给`HttpTransportContext`

传递到了`DefaultTransportService::process`当中做处理。

```java
public enum DeviceProfileProvisionType {
    DISABLED,
    ALLOW_CREATE_NEW_DEVICES,
    CHECK_PRE_PROVISIONED_DEVICES
}
```

```java
@Data
public class ProvisionDeviceCredentialsData {
    private final String token;
    private final String clientId;
    private final String username;
    private final String password;
    private final String x509CertHash;
}
```

```java
    @Override
    public void process(ProvisionDeviceRequestMsg requestMsg, TransportServiceCallback<ProvisionDeviceResponseMsg> callback) {
        log.trace("Processing msg: {}", requestMsg);
        TbProtoQueueMsg<TransportApiRequestMsg> protoMsg = new TbProtoQueueMsg<>(UUID.randomUUID(), TransportApiRequestMsg.newBuilder().setProvisionDeviceRequestMsg(requestMsg).build());
        ListenableFuture<ProvisionDeviceResponseMsg> response = Futures.transform(transportApiRequestTemplate.send(protoMsg), tmp ->
                        tmp.getValue().getProvisionDeviceResponseMsg()
                , MoreExecutors.directExecutor());
        AsyncCallbackTemplate.withCallback(response, callback::onSuccess, callback::onError, transportCallbackExecutor);
    }
```

进入到：DeviceProvisionServiceImpl::provisionDevice

```java
    @Override
    public ProvisionResponse provisionDevice(ProvisionRequest provisionRequest) {
        String provisionRequestKey = provisionRequest.getCredentials().getProvisionDeviceKey();
        String provisionRequestSecret = provisionRequest.getCredentials().getProvisionDeviceSecret();
        if (!StringUtils.isEmpty(provisionRequest.getDeviceName())) {
            provisionRequest.setDeviceName(provisionRequest.getDeviceName().trim());
            if (StringUtils.isEmpty(provisionRequest.getDeviceName())) {
                log.warn("Provision request contains empty device name!");
                throw new ProvisionFailedException(ProvisionResponseStatus.FAILURE.name());
            }
        }

        if (StringUtils.isEmpty(provisionRequestKey) || StringUtils.isEmpty(provisionRequestSecret)) {
            throw new ProvisionFailedException(ProvisionResponseStatus.NOT_FOUND.name());
        }

        DeviceProfile targetProfile = deviceProfileDao.findByProvisionDeviceKey(provisionRequestKey);

        if (targetProfile == null || targetProfile.getProfileData().getProvisionConfiguration() == null ||
                targetProfile.getProfileData().getProvisionConfiguration().getProvisionDeviceSecret() == null) {
            throw new ProvisionFailedException(ProvisionResponseStatus.NOT_FOUND.name());
        }

        Device targetDevice = deviceDao.findDeviceByTenantIdAndName(targetProfile.getTenantId().getId(), provisionRequest.getDeviceName()).orElse(null);

        switch (targetProfile.getProvisionType()) {
            case ALLOW_CREATE_NEW_DEVICES:
                if (targetProfile.getProfileData().getProvisionConfiguration().getProvisionDeviceSecret().equals(provisionRequestSecret)) {
                    if (targetDevice != null) {
                        log.warn("[{}] The device is present and could not be provisioned once more!", targetDevice.getName());
                        notify(targetDevice, provisionRequest, DataConstants.PROVISION_FAILURE, false);
                        throw new ProvisionFailedException(ProvisionResponseStatus.FAILURE.name());
                    } else {
                        return createDevice(provisionRequest, targetProfile);
                    }
                }
                break;
            case CHECK_PRE_PROVISIONED_DEVICES:
                if (targetProfile.getProfileData().getProvisionConfiguration().getProvisionDeviceSecret().equals(provisionRequestSecret)) {
                    if (targetDevice != null && targetDevice.getDeviceProfileId().equals(targetProfile.getId())) {
                        return processProvision(targetDevice, provisionRequest);
                    } else {
                        log.warn("[{}] Failed to find pre provisioned device!", provisionRequest.getDeviceName());
                        throw new ProvisionFailedException(ProvisionResponseStatus.FAILURE.name());
                    }
                }
                break;
        }
        throw new ProvisionFailedException(ProvisionResponseStatus.NOT_FOUND.name());
    }
```

最终交由`DeviceProvisionCallback`进行处理

* 成功了则调用`DeviceProvisionCallback::onSuccess`方法发布成功消息
* 失败了则调用`DeviceProvisionCallback::onError`方法，关闭连接。
