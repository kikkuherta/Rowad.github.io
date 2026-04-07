// ════════════════════════════════════════════════════════════════
//  Supabase Client — كشوف
//  يتصل بقاعدة بيانات Supabase ويمزج بين التخزين السحابي والمحلي
// ════════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://ddmdzcqlhqkljcnhfefr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_iaZzAaHFwo9loN5IzHCHCA_htSKFzt3';

let _supabase = null;
let _isSupabaseConnected = false;

// محاولة إنشاء اتصال Supabase بشكل آمن
try {
    if (window.supabase && window.supabase.createClient) {
        _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
} catch(e) {
    console.warn('Supabase SDK غير متوفر، سيتم استخدام التخزين المحلي.', e);
}

// ══ تحميل البيانات من Supabase ══
window.loadDataFromSupabase = async function() {
    if (!_supabase) {
        console.log('لا يوجد اتصال Supabase — يعمل محلياً.');
        _loadFromLocalStorage();
        return;
    }

    try {
        // 1. حسابات المستخدمين
        const { data: accData, error: accErr } = await _supabase.from('accounts').select('*');
        if (accErr) throw accErr;
        if (accData && accData.length > 0) {
            // تحويل بيانات Supabase إلى الصيغة المتوقعة في app.js
            window.accounts = accData.map(a => ({
                id: a.id,
                username: a.username,
                password: a.password_hash, // الباسورد مخزن في عمود password_hash
                role: a.role === 'super_admin' ? 'admin' : a.role,
                name: a.name,
                classesCount: 0,
                studentsCount: 0
            }));
            window.systemAccounts = accData;
        }

        // 2. الفروع
        const { data: brData, error: brErr } = await _supabase.from('branches').select('*');
        if (!brErr && brData) {
            window.systemBranches = brData;
        }

        // 3. الطلاب
        const { data: stData, error: stErr } = await _supabase.from('students').select('*');
        if (!stErr && stData && stData.length > 0) {
            window.students = stData;
            const uniqueClasses = [...new Set(stData.map(s => s.class).filter(c => c))];
            if (uniqueClasses.length > 0) window.systemClasses = uniqueClasses;
        }

        // 4. الدرجات
        const { data: grData, error: grErr } = await _supabase.from('grades').select('*');
        if (!grErr && grData) {
            grData.forEach(g => {
                window.grades[g.student_id] = { hw: g.hw, part: g.part, exam: g.exam, act: g.act };
            });
        }

        // 5. الحضور (اليوم)
        const today = new Date().toISOString().split('T')[0];
        const { data: attData, error: attErr } = await _supabase.from('attendance').select('*').eq('date', today);
        if (!attErr && attData) {
            attData.forEach(a => {
                window.attendance[a.student_id] = a.status;
            });
        }

        _isSupabaseConnected = true;
        console.log('✅ تم الاتصال بـ Supabase بنجاح');

    } catch (err) {
        console.error('خطأ في جلب بيانات Supabase:', err);
        console.log('سيتم استخدام البيانات المحلية.');
        _loadFromLocalStorage();
    }
};

// ══ حفظ البيانات إلى Supabase ══
window.saveToSupabase = async function(table, data) {
    if (!_supabase || !_isSupabaseConnected) return false;
    try {
        const { error } = await _supabase.from(table).upsert(data);
        if (error) throw error;
        return true;
    } catch(e) {
        console.error('خطأ في الحفظ:', e);
        return false;
    }
};

// ══ إضافة سجل إلى Supabase ══
window.insertToSupabase = async function(table, data) {
    if (!_supabase || !_isSupabaseConnected) return null;
    try {
        const { data: result, error } = await _supabase.from(table).insert(data).select();
        if (error) throw error;
        return result;
    } catch(e) {
        console.error('خطأ في الإضافة:', e);
        return null;
    }
};

// ══ حفظ الحضور إلى Supabase ══
window.saveAttendanceToSupabase = async function(attendanceData) {
    if (!_supabase || !_isSupabaseConnected) return false;
    try {
        const today = new Date().toISOString().split('T')[0];
        const records = Object.entries(attendanceData).map(([studentId, status]) => ({
            student_id: parseInt(studentId),
            date: today,
            status: status
        }));
        if (records.length === 0) return true;
        
        const { error } = await _supabase.from('attendance').upsert(records, { onConflict: 'student_id,date' });
        if (error) throw error;
        return true;
    } catch(e) {
        console.error('خطأ في حفظ الحضور:', e);
        return false;
    }
};

// ══ حفظ الدرجات إلى Supabase ══
window.saveGradesToSupabase = async function(gradesData) {
    if (!_supabase || !_isSupabaseConnected) return false;
    try {
        const records = Object.entries(gradesData).map(([studentId, g]) => ({
            student_id: parseInt(studentId),
            hw: g.hw || 0,
            part: g.part || 0,
            exam: g.exam || 0,
            act: g.act || 0,
            updated_at: new Date().toISOString()
        }));
        if (records.length === 0) return true;

        const { error } = await _supabase.from('grades').upsert(records);
        if (error) throw error;
        return true;
    } catch(e) {
        console.error('خطأ في حفظ الدرجات:', e);
        return false;
    }
};

// ══ إضافة طلاب إلى Supabase ══
window.addStudentsToSupabase = async function(studentsArr) {
    if (!_supabase || !_isSupabaseConnected) return null;
    try {
        const { data, error } = await _supabase.from('students').insert(studentsArr).select();
        if (error) throw error;
        return data;
    } catch(e) {
        console.error('خطأ في إضافة الطلاب:', e);
        return null;
    }
};

// ══ Fallback: تحميل من التخزين المحلي ══
function _loadFromLocalStorage() {
    try {
        const data = localStorage.getItem('kushoof:data');
        if (data) {
            const parsed = JSON.parse(data);
            if (parsed.students && parsed.students.length) window.students = parsed.students;
            if (parsed.attendance) window.attendance = parsed.attendance;
            if (parsed.grades) window.grades = parsed.grades;
            if (parsed.accounts && parsed.accounts.length) window.accounts = parsed.accounts;
        }
    } catch(e) {
        console.warn('لا توجد بيانات محلية محفوظة.');
    }
}

// ══ هل Supabase متصل؟ ══
window.isSupabaseConnected = function() {
    return _isSupabaseConnected;
};
