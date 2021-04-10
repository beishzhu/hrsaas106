<template>
  <div>
    <el-upload :on-preview="preview" :on-remove="handleRemove" :on-change="changeFile" :before-upload="beforeUpload" :file-list="fileList" :http-request="upload" :limit="1" list-type="picture-card" action="#" :class="{ disabled:fileComputed }">
      <i class="el-icon-plus"></i>

    </el-upload>
    <el-progress v-if="showPercent" style="width:180px" :percentage="percent" />
    <!-- 预览弹层 -->
    <el-dialog title="图片" :visible.sync="showDialog">
      <img :src="imgUrl" alt="" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' //引入腾讯云的包
// 实例化上传sdk
var cos = new COS({
  SecretId: 'AKIDli7IFxEdb46tRjFsSloeHfBUYHno6kuq', // 身份识别id
  SecretKey: 'hBQVXO0OacW7ORotlQq7A1i9PRFrEl3N' // 身份秘钥
});

export default {
  data() {
    return {
      fileList: [],// 图片地址设置为数组
      showDialog: false, // 控制显示弹层
      imgUrl: '',
      currentFileUid: '',// 用一个变量 记住当前上传的图片id
      percent: 0,
      showPercent: false, // 默认不显示进度条

    }
  },
  computed: {
    fileComputed() {
      // 设定一个计算属性 判断是否已经上传完了一张
      return this.fileList.length === 1
    }
  },
  methods: {
    preview(file) {
      // 这里应该弹出一个层 层里是点击的图片地址
      this.imgUrl = file.url
      this.showDialog = true
    },
    // 删除图片
    handleRemove(file) {
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    // 添加文件
    // 修改文件时触发
    // 此时可以用fileList 因为该方法会进来很多遍 不能每次都去push
    // fileList因为fileList参数是当前传进来的最新参数 我们只需要将其转化成数组即可 需要转化成一个新的数组
    // [] => [...fileList] [] => fileList.map()
    // 上传成功之后 还会进来 需要实现上传代码的逻辑 这里才会成功
    changeFile(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    // 上传之前检查
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      // 检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 已经确定当前上传的就是当前的这个file了
      this.currentFileUid = file.uid
      this.showPercent = true
      return true //最后一定要return true
    },
    // 自定义上传动作 有个参数 有个file对象 是我们需要上传到腾讯云服务器的内容
    upload(params) {
      // console.log(params.file);
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'hr-106-1305528766', //存储桶名称
          Region: 'ap-shenzhen-fsi',//存储桶地域
          Key: params.file.name,//文件名
          StorageClass: 'STANDARD', //上传模式类型 直接默认 标准模式即可
          Body: params.file,
          onProgress: (params) => {

            this.percent = params.percent * 100
          },
        }, (err, data) => {
          // data返回数据之后应该如何处理
          console.log(err || data);
          // data中有一个statusCode ===200 的时候说明上传成功
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功 要获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成上传成功地址
            // 目前虽然是一张图 但是请注意 我们的 fileList是一个数组
            // 需要知道上传成功的是哪一张图
            // this.fileList = this.fileList.map(item => {
            console.log(1);
            console.log(this.fileList);
            this.fileList = this.fileList.map(item => {
              // 去找谁的uid等于刚刚记录下来的id
              if (item.uid === this.currentFileUid) {
                // 将成功的地址赋值给原来的url属性
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 标识这样图片已经上传完毕 这个属性要Wie我们后期应用的时候做标记
                // 保存 => 图片有大有小 =>上传速度有快有慢=>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // 将上传成功的地址 会写到了fileList中 fileList变化=> upload组件 就会根据fileList的变化而去渲染试图
            setTimeout(() => {
              this.showPercent = false  // 隐藏进度条
              this.percent = 0 //进度归0
            }, 1000)
          }
        })
      }
    }
  },

}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
