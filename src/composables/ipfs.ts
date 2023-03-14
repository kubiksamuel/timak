import { create } from 'ipfs-http-client'
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export const getFromIPFS = async (fileHash: string) => {
    const stream = ipfs.cat(fileHash)
    let content: any[] = [];
    for await (const chunk of stream) {
        content = [...content, ...chunk]
    }
    return content;
}

export const addToIPFS = async (fileToUpload: Buffer) => {
    console.log("test")
    const IPFSFile = await ipfs.add(fileToUpload);
    console.log(IPFSFile)
    return IPFSFile.path;
}