import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './api';

function LoginForm({ setCurrentUser }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const data = await loginUser(formData);
            setCurrentUser(data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || "Erreur de connexion");
        }
    };

    return (
        <form className="registration-form" onSubmit={handleSubmit}>
            <h2>Connexion Admin</h2>
            {error && <div className="form-error" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
            
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    id="email" name="email" type="email"
                    value={formData.email} onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                    id="password" name="password" type="password"
                    value={formData.password} onChange={handleChange}
                    required
                />
            </div>

            <button type="submit" style={{ marginTop: '1rem' }}>
                Se connecter
            </button>
        </form>
    );
}

export default LoginForm;
