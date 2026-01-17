import express, {Request, Response} from 'express'
import eventRoute from "./routes/EventRoute";
import authRoute from './routes/AuthRoute';
import cors, {CorsOptions} from 'cors';
import path from 'path';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

import { uploadFile } from './services/UploadFileService';



const app = express()
const port = process.env.PORT || 3000;

const corsOptions:CorsOptions = {
    origin: ['http://localhost:5050'],
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],



};
app.use(cors(corsOptions))
app.use(express.json())
app.use('/events',eventRoute);
app.use('/api/v1/auth', authRoute);
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

const webApp = express()
const webPort= 5050
webApp.use(express.static(path.join(process.cwd())));
webApp.listen(webPort, () => {console.log(`WebApp listening at http://localhost:${webPort}`)
})


app.get('/presignedUrl', async (req: Request, res: Response) => {
 try {
 const { key } = req.query;
 if (!key || typeof key !== 'string') {
    return res.status(400).send('File key is required.');
        }
 const bucket = 'images';
 const { getPresignedUrl } = await import('./services/UploadFileService');
 const presignedUrl = await getPresignedUrl(bucket, key, 3600);
res.status(200).json({ url: presignedUrl });
 } catch (error) {
 console.error('Error generating presigned URL:', error);
   res.status(500).send('Error generating presigned URL.');
 }
    });

const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req: any, res: any) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const bucket = process.env.SUPABASE_BUCKET_NAME;

        const filePath = process.env.UPLOAD_DIR;
      if (!bucket || !filePath) {
             return res.status(500).send('Bucket name or file path not configured.');
         }


        const outputUrl = await uploadFile(bucket, filePath, file);


        const fileKey = await uploadFile(bucket, filePath, file);
        res.status(200).send(fileKey);
    } catch (error) {

        res.status(500).send('Error uploading file.');
    }
});