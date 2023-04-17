import axios from 'axios'

const api_endpoint_pinata_post = "https://api.pinata.cloud/pinning/pinFileToIPFS"
const api_endpoint_pinata_get = "https://gateway.pinata.cloud/ipfs/"
const access_token = "..."
const authorization = "Bearer " + access_token

export const getFromIPFS = async (hash: string) => {
    const res = await axios.get(api_endpoint_pinata_get + hash,
        {
            headers: {
                'Accept': 'text/plain',
            },
        }
    )

    const dom = new DOMParser().parseFromString(res.data, 'text/html')
    const table_rows = dom.querySelectorAll("tr")
    const data: Array<Object> = []
    table_rows.forEach(row => {
        data.push({
            fileHash: row.children[1].children[0].href.split('/ipfs/')[1],
            name: row.children[1].children[0].innerHTML,
            size: row.children[3].innerHTML
        })
    })
    return data
}

export const addToIPFS = async (files: FileList, folderName: string) => {
    const formData = new FormData();

    Array.from(files).forEach((file) => {
      formData.append("file", file)
    })

    const metadata = JSON.stringify({
      name: folderName,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);



    const res = await axios.post(api_endpoint_pinata_post, formData, {
        maxBodyLength: Infinity,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            "Authorization": authorization
        }
    })
    return res.data.IpfsHash
}