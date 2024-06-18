import {useState} from 'react';
import axios from 'axios';

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.prevent.default();
        try {
            const response = await axios.post('http://localhost:3003/auth/signup', {email, password});
            alert(response.data.message);
        }   catch(error) {
            alert('Error signing up')
        }
    }

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type='email' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type='submit'>Signup</button>
            </form>
        </div>
    )
}

export default Signup;