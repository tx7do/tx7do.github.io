# 升级旧版本的Unity项目

## UnityEngine.Application' does not contain a definition for bundleIdentifier'

把 `Application.bundleIdentifier`修改为`Application.identifier`。

## 升级粒子系统

Unity2018.2.x之后，旧版 Particle System 相关API就完全移除掉了，这个升级器是Unity官方发布的，它可以`ParticleEmitter`, `ParticleAnimator`, `ParticleRenderer`等组件转换为`ParticleSystem` 和 `ParticleSystemRenderer`组件。
