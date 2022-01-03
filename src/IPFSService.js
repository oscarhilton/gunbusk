// import { create } from "ipfs-http-client";

export default class IPFSService {
	constructor(domain, port, path) {
    this.domain = domain
    this.port = port
    this.path = path
    this.client = null
    this.files = {}
	}

  makeClient() {
    client = window.IpfsCore.create();
  }

  async AddFile(file, name) {
    const added = await client.add(file)
    Object.assign(this.files, { [name]: added.path })
  }
}