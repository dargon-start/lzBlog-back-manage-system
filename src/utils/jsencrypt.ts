import JSEncrypt from "jsencrypt";
export function encrypt(pubKey: string, data: string) {
  const jsencrypt = new JSEncrypt();
  jsencrypt.setPublicKey(pubKey);
  const encrypted = jsencrypt.encrypt(data);
  return encrypted;
}
