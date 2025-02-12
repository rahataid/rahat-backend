export const genRandomPhone = (prefix: string) => {
    if (!prefix) prefix = "99";

    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(1000 + Math.random() * 9000).toString();

    return prefix + timestamp + random;

}