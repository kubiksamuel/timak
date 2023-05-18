import axios from "axios"
import * as IPFS from 'ipfs-core'
import { pipe } from 'it-pipe'
import all from 'it-all'
import { extract } from 'it-tar'
import toBuffer from 'it-to-buffer'
import map from 'it-map'
import Pako from 'pako'
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const api_endpoint_pinata_post = "https://api.pinata.cloud/pinning/pinFileToIPFS"
const api_endpoint_pinata_get = "https://gateway.pinata.cloud/ipfs/"
const access_token = import.meta.env.VITE_PINATA_ACCESS_TOKEN
const authorization = "Bearer " + access_token

const node = await IPFS.create()

export const getFolderFromIPFS = async (hash: string) => {
    const output = await pipe(
        node.get(hash, {
            archive: true,
            compress: true,
            compressionLevel: 5
        }),
        gzipped,
        tarballed,
        source => all(source)
    )
    const data: Array<Object> = []
    output.forEach((item) => {
        if (item.header.type === "file") {
            data.push({
                hash: item.header.name.replace(hash, ""),
                name: item.header.name.replace(hash, ""),
                size: item.header.size,
            })
        }
    })
    return data
}

export const downloadFromIPFS = async (hash: string, folderName: string) => {
    const output = await pipe(
        node.get(hash, {
            archive: true,
            compress: true,
            compressionLevel: 5
        }),
        gzipped,
        tarballed,
        source => all(source)
    )

    const zip = new JSZip();
    output.forEach(item => {
        console.log(item.header.type, item.header.name)
        if (item.header.type === 'file') {
            zip.file(item.header.name.replace(hash, ""), item.body, {binary: true})
        }
    });
    zip.generateAsync({ type: 'blob' }).then(function (content) {
        FileSaver.saveAs(content, folderName);
    });
}

export const addFolderToIPFS = async (files: FileList, folderName: string, repositoryAddress: string) => {
    const filesToAdd = []
    Array.from(files).forEach(file => {
        filesToAdd.push({
            path: repositoryAddress + '/' + file.webkitRelativePath,
            content: file
        })
    });

    let hash = ""
    for await (const result of node.addAll(filesToAdd)) {
        console.log(result)
        console.log(result.cid.toString())
        if (result.path == repositoryAddress) {
            hash = result.cid.toString()
        }
    }

    return hash
}

export const addFileToIPFS = async (file: File) => {
    const formData = new FormData()

    formData.append("file", file)

    const metadata = JSON.stringify({
        name: file.name,
    })
    formData.append("pinataMetadata", metadata)

    const options = JSON.stringify({
        cidVersion: 0,
    })
    formData.append("pinataOptions", options)

    const res = await axios.post(api_endpoint_pinata_post, formData, {
        maxBodyLength: Infinity,
        headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: authorization,
        },
    })
    return res.data.IpfsHash
}

// source: https://github.com/ipfs/js-ipfs/blob/master/packages/interface-ipfs-core/src/get.js
/**
     * @param {Source} source
     */
 async function * gzipped (source) {
    const inflator = new Pako.Inflate()

    for await (const buf of source) {
      inflator.push(buf, false)
    }

    inflator.push(new Uint8Array(0), true)

    if (inflator.err) {
      throw new Error(`Error ungzipping - message: "${inflator.msg}" code: ${inflator.err}`)
    }

    if (inflator.result instanceof Uint8Array) {
      yield inflator.result
    } else {
      throw new Error('Unexpected gzip data type')
    }
  }

  /**
   * @param {Source} source
   */
  async function * tarballed (source) {
    yield * pipe(
      source,
      extract(),
      async function * (source) {
        for await (const entry of source) {
          yield {
            ...entry,
            body: await toBuffer(map(entry.body, (buf) => buf.slice()))
          }
        }
      }
    )
  }
