import axios from 'axios'

const api_endpoint_pinata_post = "https://api.pinata.cloud/pinning/"
const api_endpoint_pinata_get = "https://gateway.pinata.cloud/ipfs/pinFileToIPFS"
const access_token = "..."
const authorization = "Bearer " + access_token
export const getFromIPFS = async (fileHash: string) => {
    const res = await axios.get(api_endpoint_pinata_get + fileHash, {
        headers: {
            'Accept': 'text/plain'
        }
    })
    console.log(res)
}

export const addToIPFS = async (fileToUpload: Blob) => {
    const formData = new FormData()
    formData.append("file", fileToUpload)
    formData.append("pinataMetadata", JSON.stringify({
        name: "test"
    }))
    formData.append("pinataOptions", JSON.stringify({
        cidVersion: 0
    }))
    const res = await axios.post(api_endpoint_pinata_post, formData, {
        maxBodyLength: Infinity,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            "Authorization": authorization
        }
    })
    console.log(res.data)
}