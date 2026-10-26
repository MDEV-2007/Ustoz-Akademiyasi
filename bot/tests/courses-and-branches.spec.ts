import { formatCourseMessage } from '../src/handlers/courses.handler';
import { formatBranchMessage } from '../src/handlers/branches.handler';
import { getCoursesListKeyboard, getCourseDetailKeyboard } from '../src/keyboards/course.keyboard';
import { getBranchesListKeyboard, getBranchDetailKeyboard } from '../src/keyboards/branch.keyboard';
import { Course, Branch, Teacher } from '../src/types/api.types';

describe('Courses & Branches Handlers and Keyboards', () => {
  const sampleCourse: Course = {
    id: 'c1',
    title: 'Professional Fonetika',
    slug: 'professional-fonetika',
    shortDescription: 'Arab tili tovushlarini to‘g‘ri talaffuz qilish kursi',
    level: 'Boshlang‘ich',
    durationMonths: 3,
    priceAmount: 850000,
    currency: 'UZS',
    targetAudience: '0 dan boshlovchilar',
    outcomes: [
      { text: 'Barcha harflarni to‘g‘ri maxrajdan chiqarish' },
      { text: 'So‘zlarni erkin o‘qish' },
    ],
    branchCourses: [
      {
        branch: {
          id: 'b1',
          name: 'Archako‘cha filiali',
          slug: 'archakocha',
          area: 'Chilonzor',
        },
      },
    ],
  };

  const sampleBranch: Branch = {
    id: 'b1',
    name: 'Archako‘cha filiali',
    officialLabel: 'Bosh filial',
    slug: 'archakocha',
    area: 'Chilonzor',
    district: 'Chilonzor tumani',
    address: 'Archako‘cha ko‘chasi, 12-uy',
    landmark: 'Mirzo Ulug‘bek metrosi yaqinida',
    phone: '+998 78 888-08-08',
    workingHours: '09:00 – 19:00',
    latitude: 41.2856,
    longitude: 69.2034,
    coursesAvailable: ['Professional Fonetika', 'Tajvid Intensiv'],
  };

  it('should format course message with all details and outcomes', () => {
    const formatted = formatCourseMessage(sampleCourse);
    expect(formatted).toContain('Professional Fonetika');
    expect(formatted).toContain('Boshlang‘ich');
    expect(formatted).toMatch(/850[\s\u00A0]000 UZS \/ oy/);
    expect(formatted).toContain('0 dan boshlovchilar');
    expect(formatted).toContain('Barcha harflarni to‘g‘ri maxrajdan chiqarish');
    expect(formatted).toContain('Archako‘cha filiali');
  });

  it('should format branch message with address, landmark, and phone', () => {
    const formatted = formatBranchMessage(sampleBranch);
    expect(formatted).toContain('Archako‘cha filiali');
    expect(formatted).toContain('Chilonzor');
    expect(formatted).toContain('Archako‘cha ko‘chasi, 12-uy');
    expect(formatted).toContain('Mirzo Ulug‘bek metrosi');
    expect(formatted).toContain('+998 78 888-08-08');
  });

  it('should generate paginated courses keyboard', () => {
    const courses = [sampleCourse];
    const keyboard = getCoursesListKeyboard(courses, 1, 5);
    expect(keyboard.inline_keyboard.length).toBeGreaterThan(0);
    // Should have button for course detail
    const firstRow = keyboard.inline_keyboard[0];
    expect(firstRow[0].text).toContain('Professional Fonetika');
    expect((firstRow[0] as any).callback_data).toBe('c_d:professional-fonetika');
  });

  it('should generate branch detail keyboard with Google Maps link when coordinates exist', () => {
    const keyboard = getBranchDetailKeyboard(sampleBranch);
    const buttons = keyboard.inline_keyboard.flat();
    const mapUrlButton = buttons.find((b: any) => 'url' in b && b.url.includes('google.com/maps'));
    expect(mapUrlButton).toBeDefined();
    if (mapUrlButton && 'url' in mapUrlButton) {
      expect(mapUrlButton.url).toContain('41.2856,69.2034');
    }
  });

  it('should format teacher message and generate teacher keyboards', () => {
    const { formatTeacherMessage } = require('../src/handlers/teachers.handler');
    const { getTeachersListKeyboard } = require('../src/keyboards/teacher.keyboard');

    const sampleTeacher: Teacher = {
      id: 't1',
      fullName: 'Professional Fonetika va Maxraj kafedrasi',
      slug: 'dept-phonetics',
      department: 'Fonetika va Maxraj',
      badge: 'Maxraj va Talaffuz mutaxassislari',
      qualification: 'Arab fonetikasi va klassik talaffuz qoidalari bo‘yicha malakali ustozlar',
      focus: '0 dan boshlagan o‘quvchilarga 28 ta harfning maxrajini o‘rgatish',
      yearsOfExperience: 3,
      languages: ['Arab tili', 'O‘zbek tili'],
    };

    const formatted = formatTeacherMessage(sampleTeacher);
    expect(formatted).toContain('Professional Fonetika va Maxraj kafedrasi');
    expect(formatted).toContain('Maxraj va Talaffuz mutaxassislari');
    expect(formatted).toContain('Fonetika va Maxraj');
    expect(formatted).toContain('3+ yil');

    const kb = getTeachersListKeyboard([sampleTeacher]);
    expect(kb.inline_keyboard.length).toBeGreaterThan(0);
    const btn = kb.inline_keyboard[0][0];
    expect(btn.text).toContain('Professional Fonetika va Maxraj');
    expect((btn as any).callback_data).toBe('t_d:dept-phonetics');
  });
});
