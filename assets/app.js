const SUPABASE_URL = 'https://pabyvfrqusvvtogzdnxf.supabase.co';
const SUPABASE_KEY = 'sb_publishable_uPfMrxZPD8-pkjEuhRhJBg_PBPzfPl4';

// Criar conexão
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Testar conexão com o banco
async function testarConexao() {
    const { data, error } = await supabaseClient
        .from('subjects')
        .select('id, name')
        .limit(1);

    if (error) {
        console.error('Erro ao conectar:', error.message);
        return;
    }

    console.log('Conexão com Supabase realizada com sucesso!', data);
}
testarConexao();

const subjects=[['Matemática','📐','Álgebra, geometria e muito mais'],['Português','📖','Gramática e interpretação'],['Física','⚛️','Conceitos e exercícios'],['Química','🧪','Reações e conteúdos'],['Biologia','🌱','Vida e ciências'],['História','🏛️','Sociedade e passado'],['Geografia','🌎','Espaço e território'],['Inglês','🔤','Vocabulário e conversação'],['Informática','💻','Tecnologia e programação'],['Redação','✍️','Escrita e argumentação'],['Filosofia','💭','Ideias e pensamento'],['Sociologia','👥','Sociedade e cultura']];
const tutors=[{name:'Ana Souza',subject:'Matemática',desc:'Explicações passo a passo e exercícios.',emoji:'👩‍🏫'},{name:'Lucas Martins',subject:'Física',desc:'Ajuda com conceitos e resolução de questões.',emoji:'👨‍🎓'},{name:'Mariana Costa',subject:'Português',desc:'Gramática, interpretação e redação.',emoji:'👩‍💻'},{name:'Pedro Lima',subject:'Química',desc:'Revisões e preparação para provas.',emoji:'🧑‍🔬'},{name:'Julia Alves',subject:'Biologia',desc:'Resumos, revisão e mapas mentais.',emoji:'👩‍🔬'},{name:'Rafael Silva',subject:'Inglês',desc:'Vocabulário, escrita e conversação.',emoji:'🧑‍🎓'}];
const read=(key)=>JSON.parse(localStorage.getItem(key)||'[]');const save=(key,v)=>localStorage.setItem(key,JSON.stringify(v));
function renderSubjects(list=subjects){document.getElementById('subjectGrid').innerHTML=list.map(s=>`<div class="subject" onclick="selectSubject('${s[0]}')"><span class="emoji">${s[1]}</span><h3>${s[0]}</h3><p>${s[2]}</p></div>`).join('')}
function filterSubjects(){let q=document.getElementById('subjectSearch').value.toLowerCase();renderSubjects(subjects.filter(s=>s[0].toLowerCase().includes(q)))}
function renderTutors(list = tutors) {
    document.getElementById('tutorGrid').innerHTML = list.map(t => `
        <article class="tutor">
            <div class="avatar">👨‍🏫</div>
            <h3>${escapeHtml(t.name)}</h3>
            <span class="tag">${escapeHtml(t.subject)}</span>
        </article>
    `).join('');
}
async function carregarTutores() {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('name, subjects')
        .eq('role', 'tutor');

    if (error) {
        console.error('Erro ao carregar tutores:', error);
        return;
    }

    tutors.length = 0;

    data.forEach(user => {
        (user.subjects || []).forEach(subject => {
            tutors.push({
                name: user.name,
                subject: subject
            });
        });
    });

    renderTutors();

    const opts = [...new Set(tutors.map(t => t.subject))];

    document.getElementById('tutorFilter').innerHTML =
        '<option value="">Todas as matérias</option>' +
        opts.map(x => `<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('');

    document.getElementById('scheduleTutor').innerHTML =
        tutors.map(t =>
            `<option value="${escapeHtml(t.name)}">${escapeHtml(t.name)} — ${escapeHtml(t.subject)}</option>`
        ).join('');
}

function filterTutors() {
    const v = document.getElementById('tutorFilter').value;

    renderTutors(
        tutors.filter(t => !v || t.subject === v)
    );
}
function selectSubject(s){document.getElementById('tutorFilter').value=s;filterTutors();document.getElementById('tutores').scrollIntoView({behavior:'smooth'})}
function chooseTutor(n){document.getElementById('scheduleTutor').value=n;document.getElementById('agenda').scrollIntoView({behavior:'smooth'})}
async function setup() {
    renderSubjects();

    await carregarTutores();

    renderSessions();
}
function renderSessions(){let ss=read('ec_sessions');let el=document.getElementById('sessions');el.innerHTML=ss.length?ss.slice().reverse().map(s=>`<div class="session"><div><strong>${escapeHtml(s.student)} · ${escapeHtml(s.tutor)}</strong><p>${escapeHtml(s.subject||'Sessão de estudo')} — ${new Date(s.date).toLocaleString('pt-BR')}</p>${s.material?`<a href="${escapeHtml(s.material)}" target="_blank" rel="noopener">Material de estudo ↗</a>`:''}</div><button class="btn btn-outline" onclick="deleteSession('${s.id}')">Cancelar</button></div>`).join(''):'<div class="empty">Você ainda não possui sessões agendadas.</div>'}
function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
document.getElementById('scheduleForm').addEventListener('submit',e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.target));let ss=read('ec_sessions');ss.push({...d,id:Date.now().toString()});save('ec_sessions',ss);e.target.reset();renderSessions();alert('Sessão registrada no protótipo!')});
function deleteSession(id){save('ec_sessions',read('ec_sessions').filter(s=>s.id!==id));renderSessions()}
let authMode = 'register';

function openModal(type) {
    authMode = type;

    const modal = document.getElementById('modal');
    const title = document.getElementById('modalTitle');
    const message = document.getElementById('authMessage');
    const form = document.getElementById('authForm');

    const nameField = form.querySelector('[name="name"]');
    const roleField = form.querySelector('[name="role"]');

    const nameLabel = nameField.closest('label');
    const roleLabel = roleField.closest('label');
    const subjectsLabel = document.getElementById('subjectsLabel');
    const submitButton = form.querySelector('button[type="submit"]');

    const isLogin = type === 'login';

    title.textContent = isLogin ? 'Entrar' : 'Criar conta';

    nameLabel.hidden = isLogin;
    roleLabel.hidden = isLogin;
    subjectsLabel.hidden = isLogin;

    nameField.required = !isLogin;

    submitButton.textContent = isLogin ? 'Entrar' : 'Criar conta';

    message.textContent = isLogin
        ? 'Entre com seu e-mail e senha.'
        : 'Crie sua conta no EstudaComigo.';

    form.reset();
    modal.classList.add('open');
}
function closeModal(){document.getElementById('modal').classList.remove('open')}
document.getElementById('authForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const d = Object.fromEntries(new FormData(form));

    const message = document.getElementById('authMessage');
    const button = form.querySelector('button[type="submit"]');

    button.disabled = true;
    message.textContent = 'Aguarde...';

    try {
        if (authMode === 'register') {

            // CADASTRAR USUÁRIO
            const { data, error } = await supabaseClient.auth.signUp({
               data: {
                name: d.name,
                requested_role: d.role,
                subjects: d.subjects
                ? d.subjects.split(',').map(s => s.trim()).filter(Boolean)
                : []
}
            });

            if (error) throw error;

            if (data.session) {
                alert('Conta criada com sucesso!');
                closeModal();
                form.reset();
            } else {
                message.textContent =
                    'Conta criada! Confira seu e-mail para confirmar o cadastro.';
            }

        } else {

            // FAZER LOGIN
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: d.email,
                    password: d.password
                });

            if (error) throw error;

            alert('Login realizado com sucesso!');
            closeModal();
            form.reset();
        }

    } catch (error) {
        message.textContent = 'Erro: ' + error.message;
    } finally {
        button.disabled = false;
    }
});
// ATUALIZAR INTERFACE DE LOGIN
function updateAuthUI(session) {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const userName = document.getElementById('userName');
    const logoutButton = document.getElementById('logoutButton');

    if (session) {
        const name = session.user.user_metadata?.name
            || session.user.email;

        loginButton.style.display = 'none';
        registerButton.style.display = 'none';

        userName.textContent = `Olá, ${name}!`;
        userName.style.display = 'inline-block';

        logoutButton.style.display = 'inline-block';
    } else {
        loginButton.style.display = 'inline-block';
        registerButton.style.display = 'inline-block';

        userName.style.display = 'none';
        logoutButton.style.display = 'none';
    }
    carregarSolicitacaoTutor(session);
}

// RECUPERAR SESSÃO AO ABRIR O SITE
async function checkSession() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao recuperar sessão:', error.message);
        return;
    }

    updateAuthUI(data.session);
}

// OBSERVAR MUDANÇAS NO LOGIN
supabaseClient.auth.onAuthStateChange((event, session) => {
    updateAuthUI(session);
});

// FAZER LOGOUT
async function logout() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        alert('Erro ao sair: ' + error.message);
        return;
    }

    alert('Você saiu da sua conta!');
}

// INICIAR VERIFICAÇÃO
checkSession();

// CARREGAR SOLICITAÇÃO DE TUTOR
async function carregarSolicitacaoTutor(session) {
    const message = document.getElementById('tutorRequestMessage');
    const form = document.getElementById('tutorRequestForm');

    if (!session) {
        message.textContent =
            'Entre na sua conta para solicitar sua participação como tutor.';

        form.style.display = 'none';
        return;
    }

    const { data, error } = await supabaseClient
        .from('tutor_requests')
        .select('id, message, status, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Erro ao consultar solicitação:', error.message);
        message.textContent = 'Não foi possível consultar sua solicitação.';
        form.style.display = 'none';
        return;
    }

    if (data.length > 0 && data[0].status === 'pending') {
        message.textContent = 'Sua solicitação está aguardando aprovação!';
        form.style.display = 'none';

    } else if (data.length > 0 && data[0].status === 'approved') {
        message.textContent = 'Sua solicitação foi aprovada! Você agora pode ser tutor.';
        form.style.display = 'none';

    } else {
        message.textContent = data.length > 0
            ? 'Sua solicitação anterior foi rejeitada. Você pode enviar outra.'
            : 'Você ainda não solicitou para ser tutor.';

        form.style.display = 'block';
    }
}

// ENVIAR SOLICITAÇÃO
document.getElementById('tutorRequestForm')
    .addEventListener('submit', async (e) => {

    e.preventDefault();

    const form = e.target;
    const button = form.querySelector('button');
    const message = document.getElementById('tutorRequestMessage');

    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert('Você precisa estar logado!');
        return;
    }

    const messageText = form.elements.message.value.trim();

    if (!messageText) {
        alert('Escreva uma mensagem antes de enviar.');
        return;
    }

    button.disabled = true;
    button.textContent = 'Enviando...';

    const { error } = await supabaseClient
        .from('tutor_requests')
        .insert({
            user_id: user.id,
            message: messageText
        });

    if (error) {
        console.error('Erro ao enviar:', error.message);
        message.textContent = 'Erro ao enviar solicitação: ' + error.message;
    } else {
        form.reset();
        alert('Solicitação enviada com sucesso!');
        await carregarSolicitacaoTutor({ user });
    }

    button.disabled = false;
    button.textContent = 'Enviar solicitação';
});
// VERIFICAR SE O USUÁRIO É ADMINISTRADOR
async function verificarAdmin() {
    const adminButton = document.getElementById('adminButton');
    const adminPanel = document.getElementById('adminPanel');

    const isAdmin = await verificarPermissaoAdmin();

    adminButton.style.display = isAdmin ? 'inline-block' : 'none';
    adminPanel.style.display = isAdmin ? 'block' : 'none';

    if (isAdmin) carregarSolicitacoesAdmin();
    return isAdmin;
}

async function verificarPermissaoAdmin() {
    const { data, error } = await supabaseClient.rpc('is_admin');

    if (error) {
        console.error('Erro ao verificar administrador:', error);
        return false;
    }

    return data === true;
}
supabaseClient.auth.onAuthStateChange(() => {
    setTimeout(() => verificarAdmin(), 0);
});

async function carregarSolicitacoesAdmin() {
    const container = document.getElementById('adminRequests');

    const autorizado = await verificarPermissaoAdmin();

    if (!autorizado) {
        container.textContent = 'Acesso não autorizado.';
        return;
    }

    container.textContent = 'Carregando solicitações...';

    const { data, error } = await supabaseClient
        .from('tutor_requests')
        .select(`
            id,
            user_id,
            message,
            status,
            created_at,
            profiles!tutor_requests_user_id_fkey (
    name
)
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        container.textContent = 'Erro ao carregar solicitações: ' + error.message;
        return;
    }

    if (!data.length) {
        container.textContent = 'Nenhuma solicitação encontrada.';
        return;
    }

    container.innerHTML = data.map(request => `
        <article class="panel">
            <h3>${escapeHtml(request.profiles?.name || 'Nome não encontrado')}</h3>

            <p>${escapeHtml(request.message)}</p>

            <p><strong>Status:</strong> ${escapeHtml(request.status)}</p>

            <small>
                Solicitado em:
                ${new Date(request.created_at).toLocaleString('pt-BR')}
            </small>

            ${request.status === 'pending' ? `
                <div style="margin-top: 15px;">
                    <button class="btn"
                        onclick="atualizarSolicitacao('${request.id}', 'approved')">
                        Aprovar
                    </button>

                    <button class="btn btn-outline"
                        onclick="atualizarSolicitacao('${request.id}', 'rejected')">
                        Rejeitar
                    </button>
                </div>
            ` : ''}
        </article>
    `).join('');
}
async function atualizarSolicitacao(id, novoStatus) {
    const autorizado = await verificarPermissaoAdmin();

    if (!autorizado) {
        alert('Você não tem permissão para isso!');
        return;
    }

    const confirmacao = confirm(
        novoStatus === 'approved'
            ? 'Deseja aprovar este tutor?'
            : 'Deseja rejeitar este tutor?'
    );

    if (!confirmacao) return;

    // Buscar o usuário da solicitação
    const { data: requestData, error: requestError } =
        await supabaseClient
            .from('tutor_requests')
            .select('user_id')
            .eq('id', id)
            .single();

    if (requestError) {
        alert('Erro ao localizar solicitação: ' + requestError.message);
        return;
    }

    // Se aprovado, atualizar o perfil do usuário
    if (novoStatus === 'approved') {
        const { error: profileError } = await supabaseClient
            .from('profiles')
            .update({ role: 'tutor' })
            .eq('id', requestData.user_id);

        if (profileError) {
            alert('Erro ao atualizar perfil: ' + profileError.message);
            return;
        }
    }

    // Atualizar situação da solicitação
    const { error } = await supabaseClient
        .from('tutor_requests')
        .update({ status: novoStatus })
        .eq('id', id);

    if (error) {
        alert('Erro ao atualizar solicitação: ' + error.message);
        return;
    }

    alert(
        novoStatus === 'approved'
            ? 'Tutor aprovado com sucesso!'
            : 'Solicitação rejeitada!'
    );

    await carregarSolicitacoesAdmin();
}



document.addEventListener('DOMContentLoaded', () => {
    setup();
});