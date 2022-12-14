import { postTxn } from "../api-deps/call-server";
import { ApiCallParam } from "../api-deps/config";
import { CONFIG } from "./config"

//pass param
const parseResultUrlFromParam = (id: string) => {
    const url = new URL("/result", window.location.origin);
    url.searchParams.set("id", id);
    return url.toString();
}

export const parseProcessUrlFromParam = (transactionHash: string) => {
    const url = new URL("/process", window.location.origin);
    url.searchParams.set("transactionHashes", transactionHash);
    return url.toString();
}

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time * 1000));
}

export const confirmTxn = async (newParam: ApiCallParam) => {
    const res = await postTxn(newParam)
    console.log(res)
    if (res.status === 400) {
        window.alert("Invalid transaction");
        console.log(res)
        return;
    }
    if (res.status === 201) {
        const resJson = await res.json();
        await delay(5)
        const replacingUrl = parseResultUrlFromParam(resJson.id);
        window.location.replace(replacingUrl);
        return;
    }
}

export async function checkApiVersion() {
    const res = await fetch(CONFIG.apiServerUrl + '/status');
    const resJson = await res.json();
    if (resJson.API_VERSION !== CONFIG.apiVersion) {
        window.alert(
            `API version mismatch, expected ${CONFIG.apiVersion}, got ${resJson.API_VERSION}`
        );
        throw new Error("API version mismatch");
        // console.error(`Failed to check API version. Error: ${err.message}`);
        // window.alert("Error happened on the server side, please contact us at contact@abstrlabs.com ")

    }
    else {
        console.log(`API version check passed. Current version: ${CONFIG.apiVersion}`)
    }
}