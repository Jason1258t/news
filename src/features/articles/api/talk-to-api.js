import axios from 'axios'
import {prompt} from '../../../pages/CreateArticle/prompt.js'

const talk = (prompt="", text) => { 
    let resp = axios.post(process.env.REACT_APP_AI_URL, {
        'model': process.env.REACT_APP_AI_MODEL,
        'messages': [
            {
                'role': 'user',
                'content': `${prompt}\ntext:\n${text}`
            },
        ],
        'response_format': {
            'type': "json_object"
        }
    },
        {
            headers: {
                "Authorization": "Bearer "+process.env.REACT_APP_AI_API_KEY
            }
        }
    )
    return resp
}

export {
    talk as talkai
}