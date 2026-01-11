import express, {Request, Response} from 'express'
import eventRoute from "./routes/EventRoute";
const app = express()
const port = 3000
app.use(express.json())
app.use('/events',eventRoute);
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

import path from 'path';
const webApp = express()
const webPort= 5050
webApp.use(express.static(path.join(process.cwd())));
webApp.listen(webPort, () => {console.log(`WebApp listening at http://localhost:${webPort}`)
})
