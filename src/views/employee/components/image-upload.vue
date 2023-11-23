<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    :http-request="uploadImage"
  >
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    // 检查函数 判断文件的类型大小
    beforeAvatarUpload(file) {
      // jpeg pag gif bmp
      const isImage = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5

      if (!isImage) {
        this.$message.error('上传头像图片只能是 JPG JPEG PNG GIF BMP 格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isImage && isLt5M
    },
    // 选择上传图片
    uploadImage(params) {
      // console.log(params.file)
      const cos = new COS({
        SecretId: 'AKIDkZN6174znRuOn153qXKipoaGm5B4tcBY',
        SecretKey: 'Ok2A7qNuKuZLA8FDyodFqhVH1tIf2IJI'
      }) // 完成COS的初始化
      cos.putObject({
        Bucket: 'human-resource-1309973836', // 存储桶名称
        Region: 'ap-chengdu', // 地域名称
        Key: params.file.name, // 文件名称
        StorageClass: 'STANDARD', // 固定值
        Body: params.file // 文件对象
      }, (err, data) => {
        if (data.statusCode === 200 && data.Location) {
          // 拿到腾讯云返回的地址
          // 通过input自定义时间将地址传出去
          this.$emit('input', 'https://' + data.Location)
        } else {
          this.$message.error(err.message) // 上传失败提示信息
        }
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
