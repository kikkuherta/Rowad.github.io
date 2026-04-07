-- ملف إعداد قاعدة بيانات Supabase (نسخ ولصق في أداة الـ SQL Editor)

-- 1. جدول الفروع
CREATE TABLE IF NOT EXISTS public.branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. جدول الحسابات والمستخدمين
CREATE TABLE IF NOT EXISTS public.accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff',
    branch_name VARCHAR(255),
    plan VARCHAR(50) DEFAULT 'free',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. جدول الطلاب
CREATE TABLE IF NOT EXISTS public.students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    num VARCHAR(50),
    class VARCHAR(50),
    branch_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. جدول الدرجات والتقييم
CREATE TABLE IF NOT EXISTS public.grades (
    student_id INTEGER PRIMARY KEY,
    hw INTEGER DEFAULT 0,
    part INTEGER DEFAULT 0,
    exam INTEGER DEFAULT 0,
    act INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. جدول الحضور والغياب (سجل يومي)
CREATE TABLE IF NOT EXISTS public.attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, date)
);

-- لضمان عمل التطبيق مباشراً من Github Pages (بدون مصادقة معقدة مبدئياً)
-- نلغي حماية الصفوف مؤقتاً لتسهيل التطوير
ALTER TABLE public.branches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance DISABLE ROW LEVEL SECURITY;

-- إضافة مدير النظام الافتراضي (كلمة المرور: admin123)
INSERT INTO public.branches (name) VALUES ('الفرع الرئيسي');
INSERT INTO public.accounts (name, username, password_hash, role, branch_name, plan) 
VALUES ('أحمد السلمي (أنت)', 'admin', 'admin123', 'super_admin', 'الفرع الرئيسي', 'enterprise');
