# Crosssout

![Frame 2 (1)](https://github.com/yeonhwan/crossout/assets/81786662/814a8205-0798-443c-b31d-4575b53d08e5)

## Crossout을 소개합니다! 🤗

### " Crossout " 은 간단한 하루 관리 웹 어플리케이션이예요!

**_이러한 것들을 기록하고 관리할 수 있도록 도와준답니다._** <br><br>
**1. ✔︎ 오늘 해야할 일이나 했던 일** <br>
**2. 📝 오늘 하루 느낀 감정이나 있었던 일들** <br>
**3. 💵 오늘 하루의 수입이나 지출과 출처** <br>

**_그리고 말이죠!_**<br><br>
**1. 🗓️ 하루 관리를 달력 보기를 통해 간단하게 날짜를 이동하며 쉽게 할 수 있어요.** <br>
**2. 📊 당신의 하루 하루 들이 어땠었는지 년 단위 그래프로 관리하고 간단한 정보를 얻을 수 있어요.** <br>
**3. 🏞️ 어플리케이션의 테마와 배경을 옵션을 통해 변경하고 저장할 수 있어요.** <br>

<hr>

#### 배포 링크

https://crossout.vercel.app

**테스트를 위한 테스트 계정** <br>
Email: testaccount@test.com <br>
Password: 1234qwerty! <br>

<hr>

## 상세한 설명이 필요하신가요? 🧐

### 1. 다음과 같은 기술들을 통해 만들어졌습니다.

#### ✏️ 언어

<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">

#### 🔌 프로젝트 스타터

<img src="https://img.shields.io/badge/t3app-9933CC?style=for-the-badge">

#### 🖥️ 프론트엔드

<img src="https://img.shields.io/badge/next-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"><img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=0082B7"><img src="https://img.shields.io/badge/tanstackquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"><img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"><img src="https://img.shields.io/badge/mui-007FFF?style=for-the-badge&logo=mui&logoColor=white"><img src="https://img.shields.io/badge/framermotion-0055FF?style=for-the-badge&logo=framer&logoColor=white"><img src="https://img.shields.io/badge/zustand-7C3E0A?style=for-the-badge"><img src="https://img.shields.io/badge/nivo-259318?style=for-the-badge"><img src="https://img.shields.io/badge/dndkit-515151?style=for-the-badge"><img src="https://img.shields.io/badge/lexical-127290?style=for-the-badge"><img src="https://img.shields.io/badge/dayjs-C99E33?style=for-the-badge"><img src="https://img.shields.io/badge/nextauth-6E1D86?style=for-the-badge">

#### ⚒️ 백엔드

<img src="https://img.shields.io/badge/next-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"><img src="https://img.shields.io/badge/prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white"><img src="https://img.shields.io/badge/trpc-2596BE?style=for-the-badge&logo=trpc&logoColor=white"><img src="https://img.shields.io/badge/zod-123CA5?style=for-the-badge"><img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">

#### 🚀 배포환경

<img src="https://img.shields.io/badge/vercel-000000?style=for-the-badge&logo=vercel&logoColor=white"><img src="https://img.shields.io/badge/planetscale-101010?style=for-the-badge&logo=planetscale&logoColor=white">

#### 📍 테스트 (Sign-in / Sign-up)

<img src="https://img.shields.io/badge/cypress-26D9B3?style=for-the-badge&logo=cypress&logoColor=white">

<hr>

### 2. 다음과 같은 기능들을 제공합니다.

#### 로그인 / 회원 가입

- 구글과 깃헙 OAuth 2.0 로그인 / 회원 가입
- 전통적 방식의 이메일, 비밀번호 로그인 / 회원 가입
- 로그인 / 회원 가입 시 유효성 검사와 피드백
- 동일 이메일 정보에 대해 자동적 계정 연결

#### 메인 페이지

##### 투두리스트

- 투두리스트의 CRUD
- 클릭을 통해 투두리스트의 완료 / 복구 처리 기능
- 드래그 앤 드랍을 통해서 투두리스트의 순서를 변경 하고 저장
- 정렬 기능을 설정하고 세션동안 저장하여 투두리스트를 정렬 가능
- 투두리스트를 생성하고 수정하는 데에 유효성 검사 및 피드백 적용
- 리스트보드를 추가함으로써 투두리스트를 종류별로 정리 가능

##### 데이로그 (일기)

- 기분 기록하기 및 데이로그의 CRU (삭제기능은 개발 중에 있습니다. 내용을 비우는 것으로 임시 삭제 처리가 가능합니다.)
- 기분을 표시하는 데에 lottie 애니메이션을 통해 직관적으로 표시
- 텍스트 에디터를 통해 데이로그의 내용을 간단하게 수정 가능 (WYSIWYG) (Lexical을 사용해 개발되었습니다.)
- 일정 시간동안 데이터의 변경 사항이 없으면 변경 사항을 자동 저장

##### 수입 및 지출

- 수입 지출 및 목적의 CRUD
- 수입만 보기, 지출만 보기, 모두 보기 기능

#### 달력 / 날짜 선택

- 버튼과 달력을 통해서 원하는 날짜로 손쉬운 이동 가능
- 선택된 날짜에 대해서 해당 데이터를 미리보기 형식으로 확인 가능
- 준비된 탭을 통해서 원하는 카테고리로 이동 가능

#### 리스트보드

- 리스트 보드의 CRUD
- 리스트보드 별로 정리된 투두리스트들을 확인할 수 있음
- 리스트보드 내에서도 해당 투두리스트의 정보와 기능을 모두 확인하고 사용 가능
- 클릭 상호작용에 대한 애니메이션 적용

#### 나의 기록

- 선택된 년도와 카테고리를 바탕으로 해당 년간 데이터 그래프를 확인 가능
- 선택된 년도와 카테고리를 바탕으로 간략히 요약된 원 그래프를 확인 가능
- 보다 나은 하루 관리를 위한 추가 적인 요약 정보 제공

#### 설정

- 사용자 이름 변경 가능
- 원하는 테마 (라이트, 다크)를 설정하고 즉시 적용 및 저장 가능
- 원하는 배경 (애니메이션, 심플)을 설정하고 즉시 적용 및 저장 가능
- 계정 삭제

#### 어플리케이션

- 반응형 디자인 적용
- PWA 설정 적용

<hr>

### 3. 스크린샷

#### PC

**첫 화면** <br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/11279d72-7a66-4f18-a5fa-9c85e1e9d311" width="500" height="250"><br><br>
**로그인 / 회원 가입** <br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/b2e42377-e601-4b4d-9259-a9a66153de6c" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/b915c9e1-5235-4059-b9af-2f8eca11f6ea" width="500" height="250"><br><br>
**메인 페이지**<br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/eb5e5ce6-8b95-4e2a-85f8-6623e34f3231" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/fa7928bb-06c6-40a0-b129-4e9c4d34cac2" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/1acce3c7-cef3-4aad-8dc6-1889dc68b23e" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/35b40bd9-71fe-4132-a9a9-88223c4c0a46" width="500" height="250"><br><br>
**달력**<br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/fac7a867-5bd3-48fd-a086-5c94500bfe91" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/d04ea152-776c-4501-a249-b7271b62607e" width="500" height="250"><br><br>
**리스트보드**<br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/502cafc0-a989-42dd-aaaa-d8d17861021a" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/1909972d-96c2-40f9-a02f-f4273253f783" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/82420c72-a4b2-44c5-a5ce-9b3528f344f3" width="500" height="250"><br>
**나의 기록**<br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/62707940-43c0-4546-b9d1-69425dea190e" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/d0c65229-581c-4d40-bf35-d9ba91eb40b4" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/a9dbd124-a3d8-42fb-b06f-469dd32d26d0" width="500" height="250"><br>
**설정**<br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/b62ba6f4-80d3-45aa-925b-b3930a97efc3" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/40fadd08-3356-4fc3-a44d-165512782663" width="500" height="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/592763cb-8556-43cf-ab12-a8f7e0c8c536" width="500" height="250"><br><br>

#### 모바일

**첫 화면** <br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/a1e14b1f-336a-48ab-9194-cfe3080de2f7" width="250"><br><br>
**로그인 / 회원 가입** <br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/091b0b9a-3205-45bf-a8af-9cc0422d452d" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/672a1b22-bcd5-4d65-b29d-9769a4c2382d" width="250"><br><br>
**메인 페이지** <br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/e9bbe70c-8550-45b6-93aa-0aab0e9e9c08" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/e7439c43-2a40-452d-ac98-110fcf38b9e2" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/5c3c2edb-4479-4740-8d0a-b6b85256ac49" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/625d8eb1-8aca-447e-9e66-a54ac805a9bc" width="250"><br><br>
**달력** <br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/d14b46ab-df71-46f6-897c-03afb9f1bcdf" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/fc2fdaf2-1f83-400d-a306-113c8d7ed8e8" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/1fca49b8-16b3-486a-b42b-be9a13ebfcee" width="250"><br><br>
**리스트보드** <br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/138d9c88-edab-4a9e-b163-7088850bb4da" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/a0eac3d8-5b65-4cb8-ad01-6981c6810075" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/684c3678-429d-4f97-a976-1e2174de9bea" width="250"><br><br>
**나의 기록** <br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/d8262538-8fd5-4943-8513-196cb19a9742" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/a6b83dd3-409a-4658-802c-068f01b66c6f" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/5021c063-15d0-4c66-bd46-df12c7da0922" width="250"><br><br>
**설정** <br><br>
<img src="https://github.com/yeonhwan/crossout/assets/81786662/9f7237ca-3ae7-4c98-b1bb-9f51fe4c90f6" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/75774c77-1712-4f7b-aa10-805bd86073dd" width="250">
<img src="https://github.com/yeonhwan/crossout/assets/81786662/d532fb34-2b48-4033-ae6a-9fbc58118053" width="250"><br><br>
