# MILPICK API 연동 가이드 (프론트엔드용)

본 문서는 MILPICK 프로젝트의 프론트엔드 연동을 위한 API 명세서입니다. 
모든 API는 `http://localhost:3000` 을 베이스 URL로 사용합니다.

---



## 1. 전공 기반 군사 분야 키워드 추천 API

사용자가 대학교 학과(전공)를 입력했을 때, 해당 학과와 연관된 군사 특기 키워드들을 추천해 주는 API입니다. 
프론트엔드에서는 이 API를 호출해 추천 키워드들을 사용자에게 UI로 보여주고, 사용자가 원하는 키워드를 선택할 수 있게 해야 합니다.

- **URL:** `GET /search/recommend`
- **Query Parameter:**
  - `major` (String, 필수): 사용자가 입력한 전공명 (예: "소프트웨어")
- **Response (200 OK):**
```json
{
  "recommended_fields": [
    "소프트웨어", "공학", "IT", "컴퓨터", "정보", "통신"
  ]
}
```

---

## 2. 전체 분야(키워드) 목록 조회 API

특정 전공과 무관하게 사용자가 전체 분야 목록을 직접 보고 선택하고 싶을 때(예: "직접 선택하기") 사용할 수 있도록 DB에 존재하는 모든 분야 키워드를 중복 없이 정렬하여 반환합니다.

- **URL:** `GET /search/fields`
- **Response (200 OK):**
```json
{
  "fields": [
    "IT", "경영", "공학", "디자인", "미디어", "반도체", "소프트웨어", "인터넷", "컴퓨터", ...
  ]
}
```

---

## 3. 결격 조건 목록 조회 API

사용자에게 자신이 가진 신체적/건강상 결격 조건(예: 디스크, 색약 등)을 선택지로 제공할 수 있도록, DB에 존재하는 모든 결격 조건 키워드를 중복 없이 반환합니다.

- **URL:** `GET /search/exclusions`
- **Response (200 OK):**
```json
{
  "exclusions": [
    "관절이상", "디스크", "색각장애", "색맹", "색약", "수전증", "심장질환", "언어장애", "청력장애"
  ]
}
```

---

## 4. 군사 특기병 조건 검색 API

사용자가 선택한 키워드(분야)와 신체 조건 등을 바탕으로 지원 가능한 군사 특기를 모두 검색하여 반환합니다.

- **URL:** `POST /search`
- **Request Body (JSON):**
  검색 조건은 모두 선택(Optional) 사항입니다. 
  - `field` 배열에는 `GET /search/fields` 또는 `GET /search/recommend`를 통해 얻은 키워드를 넣습니다.
  - `exclude` 배열에는 `GET /search/exclusions`를 통해 얻은 결격사유 키워드를 넣습니다.
  - `relation_type`은 `"direct"`, `"indirect"`, `"all"` 중 하나를 입력하여 검색되는 분야의 직/간접 연관도를 설정할 수 있습니다. (기본값: `"all"`)
  - `recruitment_type` 배열(또는 문자열)을 통해 "전문특기병", "어학병" 등 특정 모집구분만 필터링할 수 있습니다.
```json
{
  "field": ["소프트웨어", "전산"],          // 검색할 분야(키워드) 배열 (필수 아님)
  "exclude": ["색각이상", "디스크"],        // 제외할 기피/결격 조건 배열 (필수 아님)
  "height": 175,                          // 신장(cm) (Number)
  "physical_grade": 2,                    // 신체 등급(1~4) (Number)
  "vision": 0.8,                          // 시력 (Number)
  "relation_type": "direct",              // "direct", "indirect", "all" 중 택 1 (선택 사항)
  "recruitment_type": ["전문특기병"]         // 필터링할 모집구분 배열 (선택 사항)
}
```

- **Response (200 OK):**
  검색 결과에 맞는 특기 목록이 배열로 반환됩니다. `direct_fields`, `indirect_fields`, `certifications`는 관련 항목들이 쉼표(`,`)로 결합된 하나의 문자열로 내려옵니다.
  만약 `field` 검색 조건을 넣었다면, 각 특기가 선택한 분야와 직접 연관인지 간접 연관인지를 알려주는 `match_type` 필드가 포함됩니다.
```json
[
  {
    "recruitment_type": "전문특기병",
    "specialty_code": "175105",
    "specialty_name": "S/W개발병",
    "category": "기타",
    "duty_description": "군의 정보체계(서버, 네트워크 등) 구축 및 S/W 개발 지원",
    "qualification_description": "소프트웨어 개발 관련 전공자 또는 관련 자격증 소지자",
    "major_required": 1,
    "age_limit_min": 18,
    "age_limit_max": 28,
    "physical_grade_max": 3,
    "physical_condition_raw": "신체등급 1~3급 현역입영대상자",
    "height_min_cm": null,
    "height_max_cm": null,
    "weight_min_kg": null,
    "weight_max_kg": null,
    "vision_min": null,
    "workplace": "전국 각급 부대",
    "additional_info": "면접 및 실기평가 실시",
    "direct_fields": "소프트웨어, 전산, 전자계산, 컴퓨터",
    "indirect_fields": "IT, 미디어, 인터넷, 정보보호, 정보시스템",
    "certifications": "정보처리기사, 정보보안기사",
    "match_type": "direct"
  }
]
```

---

## 5. 전체 특기 목록 조회 API (프론트엔드 실시간 라이브 검색용)

프론트엔드에서 전체 군사특기 데이터를 일괄 로드하여 클라이언트 라이브 검색을 수행할 수 있도록, 데이터베이스에 등록된 전체 군사특기 목록을 반환합니다. (인메모리 캐싱 적용)

- **URL:** `GET /specialties/all`
- **Query Parameter:**
  - `recruitment_type` (String, 선택): 특정 모집구분(`기술행정병`, `전문특기병`, `취업맞춤특기병`, `어학병`, `카투사`)만 필터링할 경우 지정. 생략 시 전체 반환
- **Response (200 OK):**
  전체 특기 객체 배열이 반환됩니다.
```json
[
  {
    "recruitment_type": "전문특기병",
    "specialty_code": "171101",
    "specialty_name": "정보보호병",
    "category": "소프트웨어",
    "duty_description": "ㅇ 육군 전산망 정보보호체계 운용 및 침해사고 대응 업무 수행\nㅇ 정보보호 정책 준수 상태 점검 및 취약점 분석",
    "qualification_description": "정보보안기사, 산업기사 또는 전산 관련 학과 2년 수료 이상",
    "major_required": 1,
    "age_limit_min": 18,
    "age_limit_max": 28,
    "physical_grade_max": 2,
    "physical_condition_raw": "신체등급 1~2급 현역병 입영대상자",
    "certifications": "정보보안기사, 정보처리기사, CISA, CISSP 등"
  }
]
```

---

## 🚨 프론트엔드 구현 시 주의사항 (권장)

조회된 결과 목록 중 `recruitment_type` (모집구분) 값을 확인하여 다음과 같은 사용자 안내를 처리해 주시기 바랍니다.

- **기술행정병 외 특수 모집구분 처리:** 
  `recruitment_type`이 `전문특기병`, `어학병`, `카투사` 등인 경우, 해당 특기들은 신체조건 외에도 실기평가, 면접, 특수 자격요건(단증, 어학점수 등)이 필요할 수 있습니다.
- **특수 모집구분 안내 메시지 노출:** 
  따라서 프론트엔드 화면에서 위 특기들을 렌더링할 때는 **"해당 특기는 신체조건 외에도 실기/면접이나 특수 자격요건(단증, 어학점수 등)이 필요할 수 있으니 병무청 모집요강을 반드시 추가로 확인하세요."** 라는 경고/안내 메시지를 카드 하단 등에 띄워주는 것을 강력히 권장합니다.
- **전공 불일치 시 자격증 요구 처리:** 
  조회된 특기의 `major_required`가 `1`(전공 필수)인데 사용자의 실제 전공 분야와 직접 일치하지 않는 경우를 대비해, **"해당 특기는 전공 필수이므로, 본인의 전공과 무관할 경우 관련 자격증(`certifications` 목록 참고)을 별도로 취득해야 지원이 가능합니다."** 라는 안내 메시지를 띄워주는 것이 좋습니다.
