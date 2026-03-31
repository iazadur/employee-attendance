Employee Attendance System এর জন্য দুটো ডায়াগ্রাম বানিয়ে দিচ্ছি — Use Case Diagram আর Class Diagram। চলো শুরু করি।

---

## Use Case Diagram

System-এ কারা কারা involve এবং তারা কী কী করতে পারে সেটা দেখাচ্ছে।---

## Class Diagram

এখন system-এর classes, attributes, methods, এবং relationships দেখানো হচ্ছে।---

## Summary (Assignment-এর জন্য)

**Use Case Diagram-এ রয়েছে:**
- তিনটি Actor — Employee, Admin, System
- সাতটি Use Case — Mark Attendance, View Attendance, Apply Leave, Generate Report, Manage Employees, Approve/Reject Leave, Send Notification
- `«include»` relationship — Leave approve ও Mark Attendance হলে notification যায়



**Class Diagram-এ রয়েছে:**

| Class | ভূমিকা |
|---|---|
| `Person` (abstract) | Employee ও Admin-এর parent class |
| `Employee` | Check-in/out, leave apply করে |
| `Admin` | Employee manage করে, report বানায় |
| `Attendance` | প্রতিদিনের হাজিরার রেকর্ড |
| `LeaveRequest` | ছুটির আবেদন ও status |
| `Report` | Attendance report generate করে |
| `Notification` | Alert পাঠায় employee-কে |
| `Shift` | কর্মঘণ্টা schedule |

**Relationships:** Inheritance (Person → Employee/Admin), Composition (Employee → Attendance/Leave), Dependency (Admin → Report/Approve)

Lab report এবং presentation-এর জন্য আরও কী লাগবে বলো — sequence diagram, ER diagram, বা project structure দিতে পারি।