let conversationHistory = [];
let debriefSpecialty    = '';
const MAX_EXCHANGES     = 8;

function initDebrief(specialty) {
  debriefSpecialty    = specialty;
  conversationHistory = [];

  const firstQuestion = 'Разкажете ми — как се научихте на занаята си? Кой ви учи за първи път?';
  appendDebriefMessage('ai', firstQuestion);
  conversationHistory.push({ question: firstQuestion, answer: '' });
}

function appendDebriefMessage(role, text) {
  const chat = document.getElementById('debrief-chat');
  if (!chat) return;

  const div = document.createElement('div');
  div.className = `debrief-message debrief-${role}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function submitDebriefAnswer() {
  const input  = document.getElementById('debrief-input');
  const answer = input?.value?.trim();
  if (!answer) return;

  input.value = '';
  appendDebriefMessage('user', answer);

  // Fill in the answer for the last unanswered question
  if (conversationHistory.length > 0) {
    conversationHistory[conversationHistory.length - 1].answer = answer;
  }

  // After MAX_EXCHANGES, show finalize button instead of asking more
  if (conversationHistory.length >= MAX_EXCHANGES) {
    document.getElementById('debrief-input-wrap')?.style && (document.getElementById('debrief-input-wrap').style.display = 'none');
    document.getElementById('finalize-btn')?.style       && (document.getElementById('finalize-btn').style.display = 'block');
    return;
  }

  // Typing indicator
  const typingDiv = document.createElement('div');
  typingDiv.className = 'debrief-message debrief-ai debrief-typing';
  typingDiv.textContent = '...';
  document.getElementById('debrief-chat').appendChild(typingDiv);

  try {
    const completedHistory = conversationHistory.slice(0, -1); // exclude last incomplete turn
    const data = await apiPost('/api/ai/debrief', {
      conversation_history: completedHistory,
      latest_answer:        answer,
      specialty:            debriefSpecialty
    });

    typingDiv.remove();
    appendDebriefMessage('ai', data.next_question);
    conversationHistory.push({ question: data.next_question, answer: '' });

  } catch (err) {
    typingDiv.remove();
    appendDebriefMessage('ai', 'Имам технически проблем. Моля опитайте отново.');
  }
}

async function finalizeDebrief(legendId) {
  const btn = document.getElementById('finalize-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Generating document...'; }

  try {
    const data = await apiPost('/api/ai/debrief/finalize', {
      legend_id:         legendId,
      full_conversation: conversationHistory.filter(t => t.answer),
      specialty:         debriefSpecialty
    });

    const resultEl = document.getElementById('debrief-result');
    const docEl    = document.getElementById('debrief-document');
    if (resultEl) resultEl.style.display = 'block';
    if (docEl)    docEl.textContent       = data.document;

  } catch (err) {
    alert('Failed to generate document: ' + err.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Generate Knowledge Document'; }
  }
}

// Allow pressing Enter to submit answer
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('debrief-input');
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitDebriefAnswer();
    }
  });
});
