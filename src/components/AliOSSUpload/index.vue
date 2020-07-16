<script>
import { Upload } from 'element-ui'
import OSS from 'ali-oss'
import { getToken } from '@/api/oss'

export default {
  name: 'AliOSSUpload',
  mixins: [Upload],
  props: {
    ossOnSuccess: {
      type: Function,
      default: Function
    },
    httpRequest: {
      type: Function,
      default: async params => {
        try {
          const { result } = await getToken()
          const ossClient = new OSS({
            region: 'oss-cn-shanghai',
            accessKeyId: result.AccessKeyId,
            accessKeySecret: result.AccessKeySecret,
            stsToken: result.SecurityToken,
            bucket: result.bucket
          })
          const file = params.file
          ossClient.put(file.name, file).then(val => {
            if (val.res.statusCode === 200) {
              params.onSuccess(val)
            }
          }, err => {
            params.onError(err)
          })
        } catch (e) {
          params.onError(e)
        }
      }
    }
  },
  methods: {}
}
</script>

<style scoped>

</style>
