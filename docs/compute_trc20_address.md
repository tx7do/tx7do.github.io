# 计算TRC20地址

## Python

### 使用tronpy软件包

```python
from tronpy.keys import PrivateKey

# 指定私钥（请替换为你实际的私钥）
private_key_hex = "your_private_key_hex_string"

# 将十六进制私钥转换为PrivateKey对象
private_key = PrivateKey(bytes.fromhex(private_key_hex))

# 从私钥派生公钥
public_key = private_key.public_key

# 从公钥生成TRC地址
address = public_key.to_base58check_address()

print("私钥 (十六进制):", private_key_hex)
print("公钥 (十六进制):", public_key.hex())
print("TRC地址:", address)
print('\n')
```

### 寻常算法

```python
import hashlib
import base58
import ecdsa

# 示例私钥，可替换为你自己的私钥
private_key_hex = "your_private_key_hex_string"

# 将十六进制私钥转换为字节形式
private_key_bytes = bytes.fromhex(private_key_hex)

# 使用 SECP256k1 曲线生成私钥对象
sk = ecdsa.SigningKey.from_string(private_key_bytes, curve=ecdsa.SECP256k1)

# 从私钥派生公钥
vk = sk.get_verifying_key()
public_key_bytes = vk.to_string()
public_key_point = vk.pubkey.point

# Hash the public key using Keccak-256
public_key_hash = keccak(public_key_bytes)

# Take the last 20 bytes of the hash and prepend 0x41
# 添加 TRON 地址前缀 (0x41)
tron_prefix = b'\x41'
prefixed_hash160 = tron_prefix + public_key_hash[-20:]

# 对添加前缀后的结果进行两次 SHA-256 哈希以获取校验和
first_sha256 = hashlib.sha256(prefixed_hash160).digest()
second_sha256 = hashlib.sha256(first_sha256).digest()

# 取前 4 字节作为校验和
checksum = second_sha256[:4]

# 将前缀、哈希结果和校验和拼接
full_payload = prefixed_hash160 + checksum

# Convert to hexadecimal string
trc_address_hex = prefixed_hash160.hex()

# 使用 Base58 编码生成最终的 TRC 地址
trc_address = base58.b58encode(full_payload).decode()

# 打印私钥（以十六进制字符串形式）
print("私钥 (十六进制):", sk.to_string().hex())
# 打印公钥（以十六进制字符串形式）
print("公钥 (十六进制):", vk.to_string().hex())
# 打印公钥对应的椭圆曲线上的点
print("公钥对应的椭圆曲线上的点:")
print("  x 坐标 (十六进制):", hex(public_key_point.x()))
print("  y 坐标 (十六进制):", hex(public_key_point.y()))
print("Keccak-256哈希:", public_key_hash.hex())
print("校验和:", checksum.hex())
print("完整地址数据:", full_payload.hex())
print("TRC 地址数据:", trc_address_hex)
print("TRC 地址:", trc_address)
print('\n')
```
