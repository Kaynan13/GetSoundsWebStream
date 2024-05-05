import { createServer } from "node:http"
import url from "url"
import ytdl from 'ytdl-core'

createServer(async (request, response) => {
    const headers = {
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': "*",
    }

    if (request.method === "OPTIONS") {
        response.writeHead(204, headers)
        response.end()
        return;
    }    

    var urlData = url.parse(request.url, true);

    var videoId = urlData.query['id'];

    if (urlData.pathname == '/getAudio') {
        response.setHeader('Content-Disposition', `attachment; filename="${videoId}.mp3"`)

        if (videoId && videoId != 'undefined') {
                const stream = ytdl(`https://www.youtube.com/watch?v=${videoId}`, { format: 'mp3', filter: 'audioonly', quality: 'lowest' });

                await stream.pipe(response);            
        } else {
            response.end();
        }
    }

    if (urlData.pathname == '/getInfos') {
        response.setHeader('Content-Type', 'application/json')
        response.writeHead(200, headers)
        const infos = await ytdl.getInfo(videoId) ?? null;


        response.write(JSON.stringify(infos.videoDetails))
        response.end()
    }
})
    .listen(80, () => console.log('server is running at 9000'))