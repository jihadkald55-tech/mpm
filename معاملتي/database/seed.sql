-- Seed data for Moamalaty Platform

-- Insert provinces
INSERT INTO provinces (name_ar, name_en, code) VALUES
('بغداد', 'Baghdad', 'BGD'),
('البصرة', 'Basra', 'BSR'),
('نينوى', 'Nineveh', 'NIN'),
('الأنبار', 'Anbar', 'ANB'),
('ديالى', 'Diyala', 'DIY'),
('كربلاء', 'Karbala', 'KRB'),
('النجف', 'Najaf', 'NAJ'),
('ذي قار', 'Dhi Qar', 'DHI'),
('ميسان', 'Maysan', 'MAY'),
('القادسية', 'Al-Qadisiyyah', 'QAD'),
('واسط', 'Wasit', 'WAS'),
('بابل', 'Babylon', 'BAB'),
('صلاح الدين', 'Saladin', 'SAL'),
('كركوك', 'Kirkuk', 'KRK'),
('السليمانية', 'Sulaymaniyah', 'SUL'),
('أربيل', 'Erbil', 'ERB'),
('دهوك', 'Duhok', 'DHK'),
('المثنى', 'Al-Muthanna', 'MUT');

-- Insert departments in Baghdad
INSERT INTO departments (name_ar, name_en, type, province_id, contact_phone, address) VALUES
('دائرة الجنسية - بغداد', 'Citizenship Office - Baghdad', 'citizenship', 1, '07701234567', 'شارع الكندي، بغداد'),
('دائرة الأحوال المدنية - بغداد', 'Civil Status Office - Baghdad', 'civil_status', 1, '07701234568', 'شارع السعدون، بغداد'),
('دائرة التقاعد - بغداد', 'Retirement Office - Baghdad', 'retirement', 1, '07701234569', 'شارع المنصور، بغداد'),
('دائرة العقارات - بغداد', 'Real Estate Office - Baghdad', 'real_estate', 1, '07701234570', 'شارع الجادرية، بغداد'),
('دائرة المرور - بغداد', 'Traffic Office - Baghdad', 'traffic', 1, '07701234571', 'شارع محمد القاسم، بغداد'),
('دائرة الجوازات - بغداد', 'Passport Office - Baghdad', 'passport', 1, '07701234572', 'منطقة الكرادة، بغداد'),
('دائرة الضرائب - بغداد', 'Tax Office - Baghdad', 'tax', 1, '07701234573', 'شارع الرشيد، بغداد'),
('أمانة بغداد', 'Baghdad Municipality', 'municipality', 1, '07701234574', 'ساحة الميدان، بغداد');

-- Insert departments in other provinces (sample)
INSERT INTO departments (name_ar, name_en, type, province_id, contact_phone, address) VALUES
('دائرة الأحوال المدنية - البصرة', 'Civil Status Office - Basra', 'civil_status', 2, '07801234567', 'شارع الكويت، البصرة'),
('دائرة الجنسية - نينوى', 'Citizenship Office - Nineveh', 'citizenship', 3, '07601234567', 'شارع الثقافة، الموصل'),
('دائرة المرور - البصرة', 'Traffic Office - Basra', 'traffic', 2, '07801234568', 'منطقة العشار، البصرة'),
('دائرة الجوازات - نينوى', 'Passport Office - Nineveh', 'passport', 3, '07601234568', 'شارع النبي يونس، الموصل');

-- Insert transaction types
INSERT INTO transaction_types (name_ar, name_en, description, department_type, required_documents, base_price, estimated_days) VALUES
('إصدار هوية وطنية', 'National ID Issuance', 'إصدار هوية وطنية جديدة', 'citizenship', ARRAY['شهادة الجنسية', 'صورة شخصية', 'بطاقة السكن'], 5000, 7),
('تجديد هوية وطنية', 'National ID Renewal', 'تجديد الهوية الوطنية المنتهية', 'citizenship', ARRAY['الهوية القديمة', 'صورة شخصية'], 3000, 5),
('استخراج جواز سفر', 'Passport Issuance', 'استخراج جواز سفر جديد', 'passport', ARRAY['الهوية الوطنية', 'شهادة الجنسية', 'صور شخصية'], 100000, 10),
('تجديد جواز سفر', 'Passport Renewal', 'تجديد جواز السفر المنتهي', 'passport', ARRAY['الجواز القديم', 'الهوية الوطنية', 'صور شخصية'], 100000, 7),
('تسجيل عقار', 'Property Registration', 'تسجيل عقار جديد', 'real_estate', ARRAY['سند الملكية', 'الهوية الوطنية', 'صك الشراء'], 150000, 30),
('نقل ملكية عقار', 'Property Transfer', 'نقل ملكية عقار من شخص لآخر', 'real_estate', ARRAY['سند الملكية', 'عقد البيع', 'هويات الطرفين'], 200000, 30),
('معاملة تقاعد', 'Retirement Process', 'معاملة تقاعد موظف', 'retirement', ARRAY['الهوية الوطنية', 'كتاب إحالة للتقاعد', 'أمر إداري'], 0, 60),
('رخصة قيادة', 'Driving License', 'استخراج رخصة قيادة جديدة', 'traffic', ARRAY['الهوية الوطنية', 'فحص طبي', 'شهادة دورة قيادة'], 40000, 14),
('تجديد رخصة قيادة', 'License Renewal', 'تجديد رخصة القيادة', 'traffic', ARRAY['الرخصة القديمة', 'الهوية الوطنية', 'فحص طبي'], 25000, 7),
('براءة ذمة', 'Clearance Certificate', 'إصدار براءة ذمة ضريبية', 'tax', ARRAY['الهوية الوطنية', 'كتاب رسمي'], 10000, 14),
('ترقين قيد', 'Birth Certificate', 'تسجيل وترقين قيد ولادة', 'civil_status', ARRAY['تقرير ولادة', 'هويات الوالدين', 'دفتر العائلة'], 2000, 7),
('شهادة جنسية', 'Citizenship Certificate', 'إصدار شهادة الجنسية العراقية', 'citizenship', ARRAY['الهوية الوطنية', 'دفتر العائلة'], 5000, 10),
('إضافة مولود لبطاقة السكن', 'Add Child to Residence', 'إضافة مولود جديد لبطاقة السكن', 'civil_status', ARRAY['شهادة الميلاد', 'بطاقة السكن', 'الهوية الوطنية'], 1000, 5);

-- Insert rejection reasons
INSERT INTO rejection_reasons (category, reason_ar, reason_en, solution_ar, solution_en) VALUES
('documents', 'نقص في الوثائق المطلوبة', 'Missing required documents', 'يرجى تقديم جميع الوثائق المطلوبة حسب القائمة', 'Please submit all required documents as listed'),
('documents', 'صور الوثائق غير واضحة', 'Documents are not clear', 'يرجى رفع صور واضحة وعالية الجودة للوثائق', 'Please upload clear and high-quality document images'),
('documents', 'الوثائق منتهية الصلاحية', 'Expired documents', 'يرجى تحديث الوثائق وتقديم نسخ سارية المفعول', 'Please update and submit valid documents'),
('information', 'معلومات غير صحيحة', 'Incorrect information', 'يرجى التأكد من صحة جميع المعلومات المدخلة', 'Please verify all entered information'),
('information', 'تضارب في المعلومات', 'Conflicting information', 'يوجد تضارب بين المعلومات المقدمة، يرجى المراجعة', 'There is a conflict in the submitted information, please review'),
('payment', 'عدم دفع الرسوم المطلوبة', 'Payment not completed', 'يرجى إكمال دفع الرسوم المقررة', 'Please complete the required payment'),
('eligibility', 'عدم استيفاء الشروط', 'Requirements not met', 'المعاملة لا تستوفي الشروط المطلوبة', 'The transaction does not meet the required conditions'),
('technical', 'خطأ تقني في النظام', 'Technical system error', 'يرجى إعادة تقديم المعاملة', 'Please resubmit the transaction'),
('verification', 'عدم التحقق من الهوية', 'Identity verification failed', 'يرجى مراجعة الدائرة شخصياً للتحقق من الهوية', 'Please visit the office in person for identity verification'),
('duplicate', 'معاملة مكررة', 'Duplicate transaction', 'يوجد معاملة سابقة بنفس البيانات', 'A previous transaction with the same data exists');

-- Insert system settings
INSERT INTO system_settings (key, value, description) VALUES
('site_name', 'معاملتي', 'اسم المنصة'),
('site_email', 'support@moamalaty.iq', 'البريد الإلكتروني للدعم'),
('priority_service_price', '50000', 'سعر خدمة الأولوية بالدينار العراقي'),
('consultation_price', '25000', 'سعر الاستشارة القانونية بالدينار العراقي'),
('max_file_size', '5242880', 'الحد الأقصى لحجم الملف بالبايت (5MB)'),
('allowed_file_types', 'pdf,jpg,jpeg,png,doc,docx', 'أنواع الملفات المسموحة'),
('notifications_enabled', 'true', 'تفعيل النظام الإشعارات'),
('email_notifications', 'true', 'إرسال إشعارات عبر البريد الإلكتروني'),
('sms_notifications', 'false', 'إرسال إشعارات عبر الرسائل النصية');
