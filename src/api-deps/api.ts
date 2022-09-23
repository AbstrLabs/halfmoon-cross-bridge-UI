import { postTxn } from "../api-deps/call-server";
import { ApiCallParam } from "../api-deps/config";


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