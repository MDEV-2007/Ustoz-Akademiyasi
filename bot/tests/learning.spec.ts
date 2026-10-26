import {
  getLearningMenuKeyboard,
  getAlphabetOverviewKeyboard,
  getAlphabetGroupKeyboard,
  getAlphabetQuizKeyboard,
} from '../src/keyboards/learning.keyboard';

describe('Arabic Alphabet & Learning Keyboards Redesign', () => {
  it('should render the clean 4-group overview keyboard', () => {
    const kb = getAlphabetOverviewKeyboard();
    const rows = kb.inline_keyboard as any[][];

    expect(rows.length).toBeGreaterThanOrEqual(4);
    // Row 1: Start 1st group
    expect(rows[0][0].text).toContain('1-guruhdan boshlash');
    expect(rows[0][0].callback_data).toBe('alpha_grp:1');

    // Row 2: 1-guruh & 2-guruh
    expect(rows[1][0].text).toContain('1-guruh');
    expect(rows[1][1].text).toContain('2-guruh');

    // Row 3: 3-guruh & 4-guruh
    expect(rows[2][0].text).toContain('3-guruh');
    expect(rows[2][1].text).toContain('4-guruh');
  });

  it('should render correct navigation buttons for group 1 (no prev, next to 2)', () => {
    const kb = getAlphabetGroupKeyboard(1);
    const rows = kb.inline_keyboard as any[][];

    // Row 0 has only next arrow (no previous)
    expect(rows[0][0].text).toContain('2-guruh');
    expect(rows[0][0].callback_data).toBe('alpha_grp:2');

    // Row 1 has Quiz button
    expect(rows[1][0].text).toContain('bilimi sinovi');
    expect(rows[1][0].callback_data).toBe('alpha_quiz:1');
  });

  it('should render both next and previous arrows for intermediate group 2', () => {
    const kb = getAlphabetGroupKeyboard(2);
    const rows = kb.inline_keyboard as any[][];

    expect(rows[0][0].text).toContain('1-guruh');
    expect(rows[0][0].callback_data).toBe('alpha_grp:1');
    expect(rows[0][1].text).toContain('3-guruh');
    expect(rows[0][1].callback_data).toBe('alpha_grp:3');
  });

  it('should render interactive quiz keyboard with correct callback flags', () => {
    const options = [
      { label: 'ت (Ta)', isCorrect: false },
      { label: 'ب (Ba)', isCorrect: true },
    ];
    const kb = getAlphabetQuizKeyboard(1, options);
    const rows = kb.inline_keyboard as any[][];

    expect(rows[0][0].callback_data).toBe('quiz_ans:1:0');
    expect(rows[0][1].callback_data).toBe('quiz_ans:1:1');
  });
});
