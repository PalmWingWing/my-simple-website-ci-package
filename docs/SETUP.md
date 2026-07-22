# วิธีติดตั้งจริงบน GitHub

ผมไม่มีสิทธิ์เข้าถึง GitHub account ของคุณ (ไม่มี token/connector ต่อไว้) เลยสร้าง repo หรือ
push ให้ไม่ได้โดยตรง — แต่ทำไฟล์ทั้งหมดพร้อมใช้แล้ว รันตามขั้นตอนนี้ได้เลย (5-10 นาที)

## 1. สร้าง repo ใหม่ (ใช้ GitHub CLI)

```bash
# login ครั้งแรก (ถ้ายังไม่เคย)
gh auth login

# สร้าง repo ใหม่ตามชื่อ convention แล้ว push โค้ดชุดนี้เข้าไป
cd my-simple-website   # โฟลเดอร์ที่แตกไฟล์ zip นี้ออกมา
git init
git add .
git commit -m "chore: initial commit with tests + CI"
gh repo create my-simple-website --private --source=. --remote=origin --push
```

หรือถ้าจะสร้างผ่านหน้าเว็บ: https://github.com/new → ตั้งชื่อ `my-simple-website` → private/public
ตามต้องการ → ห้ามติ๊ก "Add README" (จะชนกับไฟล์ที่มีอยู่แล้ว) → แล้ว push ตามคำสั่งที่ GitHub ให้มา

## 2. ตั้งค่า Workflow permissions (สำคัญ — ถ้าไม่ทำ ขั้น merge อัตโนมัติจะ fail)

Repo Settings → Actions → General → Workflow permissions
→ เลือก **"Read and write permissions"** → Save

## 3. ใส่ Secrets สำหรับ deploy + ส่งอีเมล

Repo Settings → Secrets and variables → Actions → New repository secret

| Secret | ใช้ทำอะไร |
|---|---|
| `REGISTRY_LOGIN_SERVER` | Azure Container Registry login server (มีอยู่แล้วถ้าเคยตั้งไว้กับ workflow เดิม) |
| `REGISTRY_USERNAME` | ACR username |
| `REGISTRY_PASSWORD` | ACR password |
| `AZURE_WEBAPP_PUBLISH_PROFILE` | publish profile ของ App Service |
| `MAIL_SERVER` | เช่น `smtp.gmail.com` |
| `MAIL_PORT` | เช่น `465` |
| `MAIL_USERNAME` | อีเมลที่ใช้ส่ง (ตัวเดียวกับที่จะรับก็ได้ = ส่งหาตัวเอง) |
| `MAIL_PASSWORD` | ถ้าใช้ Gmail ต้องเป็น **App Password** ไม่ใช่รหัสผ่านปกติ |
| `MAIL_TO` | อีเมลปลายทางที่จะรับแจ้งเตือนตอน CI fail (ใส่อีเมลตัวเองได้เลย) |

## 4. ตั้งค่า branch protection บน `main` (แนะนำ)

Repo Settings → Branches → Add branch protection rule → branch name pattern: `main`
→ ติ๊ก "Require a pull request before merging" → Save

(ไม่ต้องติ๊ก "Require status checks to pass" เพราะ `ci.yml` เป็นคน merge ให้เองหลังเทสต์ผ่าน
ไม่ใช่ merge ผ่านปุ่มบนหน้า GitHub)

## 5. ทดสอบ flow

```bash
git checkout -b feature/test-ci
# แก้ไฟล์อะไรสักอย่างเล็กน้อย เช่น index.html
git commit -am "test: trigger ci"
git push origin feature/test-ci
gh pr create --base main --title "Test CI flow" --body "ทดสอบ auto merge/close"
```

- ถ้าเทส 10 ข้อผ่านหมด → PR จะถูก merge เข้า main และปิดอัตโนมัติ → `deploy.yml` จะ trigger
  ต่อทันทีเพื่อ deploy ขึ้น Azure
- ถ้าเทสข้อไหน fail → คุณจะได้อีเมลแจ้ง พร้อมลิงก์ log → PR จะถูกปิด (ไม่ merge)

## รันเทสในเครื่องตัวเองก่อน push ได้เช่นกัน

```bash
npm install
npx playwright install --with-deps chromium
npm test
```
