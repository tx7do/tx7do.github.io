# Javascript和Typescript下如何通过 async/await 优雅地使用 FileReader

## 方法1

封装成一个方法

```javascript
export async function readTextFile(file: File) {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
    });
}

export async function readBinaryFile(file: File) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
    });
}

export async function readAsText(file: File) {
    const reader = new FileReader();
    reader.readAsText(file);
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
    });
}
```

使用方法：

```typescript
(async()=> {
    const buffer1 = await readTextFile(file);
    const buffer2 = await readBinaryFile(file);
    const buffer3 = await readAsText(file);
})();
```

## Javascript封装成一个class

```javascript
class FileReaderEx extends FileReader{
    constructor(){
        super();
    }

    #readAs(blob, ctx){
        return new Promise((res, rej)=>{
            super.addEventListener("load", ({target}) => res(target.result));
            super.addEventListener("error", ({target}) => rej(target.error));
            super[ctx](blob);
        });
    }

    readAsArrayBuffer(blob){
        return this.#readAs(blob, "readAsArrayBuffer");
    }

    readAsDataURL(blob){
        return this.#readAs(blob, "readAsDataURL");
    }

    readAsText(blob){
        return this.#readAs(blob, "readAsText");
    }
}
```

使用方法：

```javascript
(async()=>{
    const buffer1 = await new FileReaderEx().readAsArrayBuffer(blob1);
    const buffer2 = await new FileReaderEx().readAsDataURL(blob2);
    const buffer3 = await new FileReaderEx().readAsText(blob3);
})();
```

## TypeScript封装成一个class

```typescript
export class FileReaderEx extends FileReader {
    constructor() {
        super();
    }

    private readAs(blob: Blob, ctx: 'readAsArrayBuffer' | 'readAsDataURL' | 'readAsText') {
        return new Promise((res, rej) => {
            super.addEventListener("load", ({target}) => res(target?.result));
            super.addEventListener("error", ({target}) => rej(target?.error));

            super[ctx](blob);
        });
    }

    readAsArrayBuffer(blob: Blob) {
        return this.readAs(blob, "readAsArrayBuffer");
    }

    readAsDataURL(blob: Blob) {
        return this.readAs(blob, "readAsDataURL");
    }

    readAsText(blob: Blob) {
        return this.readAs(blob, "readAsText");
    }
}
```

使用方法：

```javascript
(async()=>{
    const buffer1 = await new FileReaderEx().readAsArrayBuffer(blob1);
    const buffer2 = await new FileReaderEx().readAsDataURL(blob2);
    const buffer3 = await new FileReaderEx().readAsText(blob3);
})();
```

## TypeScript基于泛型

```typescript
/**
 * @description 同步调用包装
 * @param promise 需要被调用的异步方法
 */
async function asyncWrap<T = any>(promise: Promise<T>): Promise<T | null> {
    try {
        return await promise;
    } catch (err) {
        return null;
    }
}

export async function fileReaderWrap<T = any>(blob: Blob, ctx: 'readAsArrayBuffer' | 'readAsDataURL' | 'readAsText'): Promise<any> {
    const reader = new FileReader();
    reader[ctx](blob);
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
    });
}

```

使用方法：

```typescript
(async()=>{
    const buffer1 = await asyncWrap<ArrayBuffer>(fileReaderWrap<ArrayBuffer>(file, 'readAsArrayBuffer'));
    const buffer2 = await asyncWrap<ArrayBuffer>(fileReaderWrap<ArrayBuffer>(file, 'readAsDataURL'));
    const buffer3 = await asyncWrap<ArrayBuffer>(fileReaderWrap<ArrayBuffer>(file, 'readAsText'));
})();
```

## 参考资料

- [【JavaScript】FileReaderをasync/awaitでエレガントに使いたい](https://qiita.com/dojyorin/items/26f1a48085e0bbcf40b7)
