import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor online 🚀');
});

app.post('/enviar', async (req, res) => {
    const { nome, telefone, email, mensagem } = req.body;

    if (!nome || !telefone || !email || !mensagem) {
        return res.status(400).json({
            success: false,
            error: 'Todos os campos são obrigatórios'
        });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Contato Site" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'Novo contato pelo site',
            text: `
Novo contato recebido pelo site

Nome: ${nome}
Telefone: ${telefone}
E-mail: ${email}

Mensagem:
${mensagem}
            `
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        return res.status(500).json({
            success: false,
            error: 'Erro interno ao enviar mensagem'
        });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});
