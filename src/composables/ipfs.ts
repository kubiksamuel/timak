import * as IPFS from 'ipfs-core'
import { pipe } from 'it-pipe'
import all from 'it-all'
import { extract } from 'it-tar'
import toBuffer from 'it-to-buffer'
import map from 'it-map'
import Pako from 'pako'
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const ipfs = await IPFS.create()

export const getFolderFromIPFS = async (hash: string) => {
    const output = await pipe(
        ipfs.get(hash, {
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
                hash: item.header.name,
                name: item.header.name.replace(hash, ""),
                size: item.header.size,
            })
        }
    })
    return data
}

export const downloadFolderFromIPFS = async (hash: string, folderName: string) => {
    const output = await pipe(
        ipfs.get(hash, {
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

export const addFolderToIPFS = async (files: FileList, repositoryAddress: string) => {
    const filesToAdd = []
    Array.from(files).forEach(file => {
        filesToAdd.push({
            path: repositoryAddress + '/' + file.webkitRelativePath,
            content: file
        })
    });

    let hash = ""
    for await (const result of ipfs.addAll(filesToAdd)) {
        console.log(result)
        console.log(result.cid.toString())
        if (result.path == repositoryAddress) {
            hash = result.cid.toString()
        }
    }

    return hash
}

export const addFileToIPFS = async (file: File) => {
    const result = await ipfs.add(file)
    return result.cid.toString()
}

export const downloadFileFromIPFS = async (hash: string, fileName: string) => {
    const output = await pipe(
        ipfs.get(hash, {
            archive: true,
            compress: true,
            compressionLevel: 5
        }),
        gzipped,
        tarballed,
        source => all(source)
    )

    if (output[0].header.type == "file") {
        FileSaver.saveAs(new Blob([output[0].body]), fileName)
    } else {
        console.error("Not a file")
    }
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
