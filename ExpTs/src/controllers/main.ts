import type { Request, Response } from 'express';
import { loremIpsum } from 'lorem-ipsum';

const index = (req: Request, res: Response) => {
    res.end('Welcome to Web academy!');
};

const about = (req: Request, res: Response) => {
    const pessoas = [
        { nome: "Giovana Lins Cavalcanti", funcao: "entidades e CSS" },
        { nome: "Arthur Capucho", funcao: "engine e UI" },
        { nome: "Arthur Matias", funcao: "engine e UI" }
    ]
    const sons = [
        { titulo: "Orange Free Sounds", url: "https://www.cavesofqud.com/" },
        { titulo: "SoundBible", url: "https://soundbible.com" },
        { titulo: "YouTube Audio Libray", url: "https://www.youtube.com/audiolibrary" }
    ]
    const sprites = [
        { titulo: "Caves of Qud", url: "https://www.cavesofqud.com/" }
    ]
    res.render("main/about", { pessoas, sons, sprites, titulo: "“Caves of Nodes”" });
}

const lorem = (req: Request, res: Response) => {
    res.send(loremIpsum({ count: Number(req.params.id), format: "html", suffix: "\n", units: "paragraphs" }));
}

const hb1 = (req: Request, res: Response) => {
    res.render("main/hb1", { mensagem: 'Olá, você está aprendendo Express + HBS!' });
}

const hb2 = (req: Request, res: Response) => {
    res.render("main/hb2", {
        name: 'React',
        type: 'library',
        poweredByNodejs: true
    });
};

const hb3 = (req: Request, res: Response) => {
    const profs = [
        { nome: 'David Fernandes', sala: 1238 },
        { nome: 'Horácio Fernandes', sala: 1233 },
        { nome: 'Edleno Moura', sala: 1236 },
        { nome: 'Elaine Harada', sala: 1231 },
    ];
    res.render("main/hb3", { profs });
}

const hb4 = (req: Request, res: Response) => {
    const technologies = [
        { name: 'Express', type: 'Framework', poweredByNodejs: true },
        { name: 'Laravel', type: 'Framework', poweredByNodejs: false },
        { name: 'React', type: 'Library', poweredByNodejs: true },
        { name: 'Handlebars', type: 'Engine View', poweredByNodejs: true },
        { name: 'Django', type: 'Framework', poweredByNodejs: false },
        { name: 'Docker', type: 'Virtualization', poweredByNodejs: false },
        { name: 'Sequelize', type: 'ORM tool', poweredByNodejs: true },
    ];
    res.render("main/hb4", { technologies });
}

export default { index, about, lorem, hb1, hb2, hb3, hb4 };
