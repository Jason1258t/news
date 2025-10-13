import axios from 'axios'
import {prompt} from '../../../pages/CreateArticle/prompt.js'
import { config, configDotenv } from 'dotenv';
configDotenv();


const talk = (text) => { 
    let resp = axios.post(process.env.AI_URL, {
        'model': process.env.AI_MODEL,
        'messages': [
            {
            'role': 'user',
            'content': `${prompt}\n${text}`
            }
        ]
    },
        {
            headers: {
                "Authorization": "Bearer "+process.env.AI_API_KEY
            }
        }
    )
    return resp
}

const res = await talk("hello")
console.log(res.data['choices'][0]['message']['content'])


// testTalk()