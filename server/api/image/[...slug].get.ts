import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type } from "arktype";
import { getQuery, getRouterParam, redirect } from "nitro/h3";
import { useRuntimeConfig } from "nitro/runtime-config";

export type GetImageQuery = typeof schema.inferIn;

const schema = type({
    fmt: "string?",
    q: "string?",
    w: "string?",
    h: "string?",
});

export default defineJEventHandler<{
    query: GetImageQuery;
}>(async (event) => {
    const config = useRuntimeConfig();
    const query = schema.assert(getQuery(event));
    const slug = getRouterParam(event, "slug");

    if (slug === void 0) {
        throw 1;
    }

    const s3 = new S3Client({
        endpoint: "https://s3.bitiful.net",
        region: "cn-east-1",
        credentials: {
            accessKeyId: config.bitiful.accessKey,
            secretAccessKey: config.bitiful.secretKey,
        },
    });

    const command = new GetObjectCommand({
        Bucket: config.bitiful.bucket,
        Key: "/garden/" + slug,
    });

    command.middlewareStack.add((next) => async (args) => {
        const request = args.request as import("@smithy/types").HttpRequest;

        request.query = {
            ...request.query,
            ...query,
            // 之后在图床上传原图后再启用这段代码
            // fmt: query.fmt ?? event.req.headers.get("accept")?.includes("image/avif")
            //     ? "avif"
            //     : "webp",
        };

        return next(args);
    }, {
        name: "bitifulImageQuery",
        step: "build",
    });

    const signedUrl = await getSignedUrl(s3, command, {
        expiresIn: 3600,
    });

    return redirect(signedUrl, 307);
});
