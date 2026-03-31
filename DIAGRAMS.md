# UML ডায়াগ্রাম ডকুমেন্টেশন

Employee Attendance System-এর জন্য দুটো ডায়াগ্রাম বানানো হয়েছে — **Use Case Diagram** আর **Class Diagram**। এগুলো সিস্টেমের কাজকর্ম এবং স্ট্রাকচার বুঝতে সাহায্য করে।

---

## Use Case Diagram

System-এ কারা কারা involve এবং তারা কী কী করতে পারে সেটা দেখায়।

### Use Case Diagram-এ রয়েছে:

**Actors (অভিনেতা):**
- **Employee** — কর্মচারী (বাম পাশে)
- **Admin** — প্রশাসক (ডান পাশে)

**Use Cases (কাজ/ফিচার):**
- **Login** — লগইন (উভয় actor এর জন্য প্রয়োজন)
- **Logout** — লগআউট
- **Check In** — অফিসে প্রবেশ রেজিস্টার করা
- **Check Out** — অফিস থেকে বের হওয়া রেজিস্টার করা
- **View Attendance History** — নিজের হাজিরা ইতিহাস দেখা
- **Submit Leave Request** — ছুটির আবেদন জমা দেওয়া
- **View Leave Status** — ছুটির স্ট্যাটাস দেখা
- **Manage Employees** — কর্মচারী ম্যানেজমেন্ট (শুধু Admin)
- **Review Leave Requests** — ছুটির আবেদন রিভিউ করা (শুধু Admin)
- **Approve/Reject Leave** — ছুটি অনুমোদন বা প্রত্যাখ্যান (Admin)
- **View Daily Attendance** — সব কর্মচারীর দৈনিক হাজিরা দেখা (Admin)
- **Generate Monthly Report** — মাসিক রিপোর্ট তৈরি করা (Admin)

**System Boundary:**
সবকিছু একটা বক্সের ভেতর থাকে যার নাম "Employee Attendance System" — এটা সিস্টেমের সীমানা নির্দেশ করে।

**Relationships:**
- সাধারণ লাইন = Actor থেকে use case এ যাওয়া (সরাসরি সম্পর্ক)
- ড্যাশড লাইন with `<<include>>` = একটা use case অন্যটা এর ভেতরে অন্তর্ভুক্ত (e.g., Approve/Reject Leave-এ Leave Request Review করা আছে)

---

## Class Diagram

System-এর classes, attributes, methods, এবং তাদের মধ্যে সম্পর্ক দেখায়।

### Class Diagram-এ রয়েছে:

| ক্লাস | ভূমিকা | Key Attributes | Key Methods |
|---|---|---|---|
| **Person** (Abstract) | Employee এবং Admin-এর parent class | person_id, name, email, password_hash, role | login(), logout() |
| **Employee** | কর্মচারী যে check-in/out করে এবং ছুটির আবেদন করে | employee_id, department, designation, salary | checkIn(), checkOut(), submitLeaveRequest(), viewAttendance() |
| **Admin** | প্রশাসক যে সবকিছু manage করে | admin_id, privilege_level | manageEmployees(), approveLeave(), generateReport(), viewAllAttendance() |
| **Attendance** | প্রতিদিনের হাজিরার রেকর্ড | attendance_id, date, check_in_time, check_out_time, status, work_hours | calculateWorkHours(), getStatus() |
| **LeaveRequest** | ছুটির আবেদন এবং এর স্ট্যাটাস | leave_id, start_date, end_date, reason, status, applied_date | submitRequest(), updateStatus() |
| **Report** | attendance report generate করার জন্য | report_id, month, year, generated_by, generated_date | generateMonthlyReport(), generateDailyReport() |
| **Notification** | কর্মচারীকে alert পাঠানো | notification_id, message, employee_id, sent_date, is_read | sendNotification(), markAsRead() |
| **Shift** | কর্মঘণ্টার সময়সূচী | shift_id, shift_name, start_time, end_time | getShiftHours() |

### Relationships (সম্পর্ক):

1. **Inheritance (উত্তরাধিকার):**
   - `Employee` এবং `Admin` দুটোই `Person` থেকে inherit করে

2. **Composition (সম্পূর্ণ সম্পর্ক):**
   - `Employee` has many `Attendance` records (এক কর্মচারীর অনেক দিনের হাজিরা)
   - `Employee` has many `LeaveRequest` (এক কর্মচারীর অনেক ছুটির আবেদন)
   - `Employee` works in one `Shift`

3. **Association (সাধারণ সম্পর্ক):**
   - `Admin` manages many `Employee`
   - `Admin` reviews `LeaveRequest`
   - `Report` contains `Attendance` data

4. **Dependency (নির্ভরতা):**
   - `Notification` depends on `LeaveRequest` status change

---

## Summary (স্টাডি ম্যাটেরিয়াল)

✅ **Use Case Diagram** = সিস্টেমের কার্যকারিতা (functional view)  
✅ **Class Diagram** = সিস্টেমের গঠন (structural view)  
✅ একসাথে ব্যবহার করলে সম্পূর্ণ system design বোঝা যায়।

---

## স্ট্যান্ডার্ড চেকলিস্ট

### Use Case Diagram Standard Compliance:
- ✅ Actors আছে system boundary এর বাইরে
- ✅ Use Cases ellipse shape এ
- ✅ System boundary labeled ("Employee Attendance System")
- ✅ Actor-UseCase association সঠিক
- ✅ Include relationships marked with <<include>> label

### Class Diagram Standard Compliance:
- ✅ 8টি classes carefully designed
- ✅ Inheritance relationships with arrows pointing up
- ✅ Attributes এবং methods স্পষ্টভাবে listed
- ✅ Multiplicity indicators (1, *, many)
- ✅ Abstract class (Person) marked
