# Naming Convention — my-simple-website

## 1. ชื่อ Repository

รูปแบบ: `kebab-case`, `<what>-<name>`, ตัวพิมพ์เล็กทั้งหมด, ไม่มีคำฟุ่มเฟือย

| ใช้ | หลีกเลี่ยง |
|---|---|
| `my-simple-website` | `MySimpleWebsite`, `my_simple_website`, `website-final-v2` |

ถ้าจะแยก repo เดิม/ใหม่ตามสภาพแวดล้อมหรือทีม แนะนำต่อท้ายด้วยบริบท เช่น
`my-simple-website` (โปรเจกต์หลัก), `my-simple-website-infra` (ถ้าจะแยก IaC ออกภายหลัง)

## 2. ชื่อ Branch

| Branch | Pattern | ตัวอย่าง | หน้าที่ |
|---|---|---|---|
| Production | `main` | `main` | โค้ดที่ deploy จริงเท่านั้น ห้าม push ตรง ต้องผ่าน PR |
| Integration | `develop` | `develop` | รวมงานก่อนขึ้น main (ถ้าทีมใช้ git-flow) |
| Feature | `feature/<ticket>-<slug>` | `feature/12-add-dark-mode` | งานฟีเจอร์ใหม่ |
| Bug fix | `fix/<ticket>-<slug>` | `fix/45-button-color` | แก้บั๊กที่ไม่เร่งด่วน |
| Hotfix | `hotfix/<ticket>-<slug>` | `hotfix/50-prod-crash` | แก้ด่วนจาก production |
| Release | `release/<version>` | `release/1.2.0` | เตรียมขึ้น production (ถ้ามี versioning) |

กติกา: ตัวพิมพ์เล็ก, คั่นคำด้วย `-`, ใส่เลข ticket/issue นำหน้าถ้ามีระบบ tracking

## 3. ชื่อ Azure Resources

ใช้รูปแบบ `<resource-type>-<workload>-<environment>` (ตาม Microsoft Cloud Adoption Framework)
โดยแต่ละ resource type มีข้อจำกัดเรื่องอักขระต่างกัน — สรุปไว้ในตาราง:

| Resource | Pattern | ตัวอย่าง (prod) | หมายเหตุ |
|---|---|---|---|
| Resource Group | `rg-<workload>-<env>` | `rg-simplewebsite-prod` | ใช้ `-` ได้ |
| Container Registry | `acr<workload><env>` | `acrsimplewebsiteprod` | **ห้ามมี `-`**, a-z0-9 เท่านั้น, ต้อง globally unique |
| App Service Plan | `plan-<workload>-<env>` | `plan-simplewebsite-prod` | ใช้ `-` ได้ |
| App Service (Web App) | `app-<workload>-<env>` | `app-simplewebsite-prod` | ต้อง globally unique (เป็นส่วนหนึ่งของ URL `*.azurewebsites.net`) |
| Container App | `ca-<workload>-<env>` | `ca-simplewebsite-prod` | ใช้ `-` ได้ |

ค่าปัจจุบันใน workflow เดิม (`mysimplewebsite.azurecr.io`, App Service `mysimplewebsite`) ไม่ตรง
convention นี้ — คงไว้ตามเดิมได้ถ้าไม่อยากรื้อของที่ deploy อยู่แล้ว แต่ถ้าตั้งใหม่ทั้งหมด
แนะนำเปลี่ยนเป็น `acrsimplewebsiteprod` / `app-simplewebsite-prod` ตามตารางด้านบน

## 4. สรุป environment suffix ที่ใช้ร่วมกันทุก resource

`dev`, `staging`, `prod` — ต่อท้ายชื่อเสมอ เพื่อให้แยก resource ระหว่าง environment ได้ชัดเจน
