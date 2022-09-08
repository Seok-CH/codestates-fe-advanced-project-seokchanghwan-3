<img src='https://cdn.discordapp.com/attachments/1016940382061346880/1016942751184597062/Pngtreecalculator_icon_3728071.png' alt='' width='200'/>

# 기업과제(아이헤이트플라잉버그스) - 계산기 웹앱

- **배포링크** : [링크클릭](https://codestates-fe-advanced-project-seokchanghwan-3.vercel.app/)
- **사용스택** : `html`, `css`, `javascript`, `react`, `typescript`
- **프로젝트 시작 방법** :

  1.  [Code버튼 클릭 > DownloadZip 클릭] 후 압축 파일 다운 받기
  2.  압축 파일을 푼 뒤 폴더 주소로 터미널에 `npm install && npm start` 입력

<br/>

## 기능 구현 리스트 및 GIF 이미지

- #### 기본 구현 사항

  - 곱셈, 나눗셈, 덧셈, 빼기 연산을 할 수 있습니다
  - 지우기 버튼을 누르면 뒤쪽에서부터 하나씩 숫자/기호가 삭제됩니다
  - 각 버튼을 누르면 화면에 선택한 숫자/기호가 표시되며 등호를 누르면 결과값을 계산할 수 있습니다
  - 초기화 버튼을 누르면 연산이 취소할 수 있습니다
  - 숫자들은 **천 단위 구분자**로 표시됩니다
  - **부호 전환** 버튼을 통해 숫자의 부호를 바꿀 수 있습니다
  - **괄호 입력**을 할 수 있습니다
  - 숫자는 최대 12짜리 입력할 수 있습니다

   <br/>
   
   <img src='https://cdn.discordapp.com/attachments/1016940382061346880/1016958007864729680/Sep-07-2022_15-27-39.gif' alt=''  height='400'/>
   <img src='https://cdn.discordapp.com/attachments/1016940382061346880/1016958739405881374/Sep-07-2022_15-30-39.gif' alt=''  height='400'/>
   
   >
   > 첫 번째 이미지: 사칙연산, 괄호 입력, 천단위 구분자, 부호전환, 결과값 반환을 확인할 수 있습니다  
   > 
   > 두 번째 이미지: 숫자 최대 입력 제한 갯수 12개, 지우기 버튼, 초기화 버튼 동작을 확인할 수 있습니다
   >

- #### 추가 구현 사항

  - **다크 모드** 기능이 있습니다
  - 수식이 화면을 넘치면 **폰트사이즈가 너비에 맞게 줄어듭니다**
  - 13자리 이상 결과값은 **과학적 표기법**으로 표시 됩니다
  - 계산을 했던 리스트를 볼 수 있는 **히스토리** 기능이 있습니다
  - 계산 결과를 미리 볼 수 있도록 하였습니다

   <br/>
   
   <img src='https://cdn.discordapp.com/attachments/1016940382061346880/1016961350729207889/Sep-07-2022_15-40-55.gif' alt=''  height='400'/>
   <img src='https://cdn.discordapp.com/attachments/1016940382061346880/1016963460711600199/Sep-07-2022_15-49-22.gif' alt=''  height='400'/>
   
   > 첫 번째 이미지: 수식이 많아지면 폰트 사이즈 자동조절, 결과값이 13자리 이상이면 과학적 표기법으로 표시, 다크모드를 확인 할 수 있습니다  
   > 
   > 두 번째 이미지: 등호버튼을 누른 것에 한해서 계산 기록 저장, 히스토리 확인 및 초기화 기능을 확인 할 수 있습니다

<br/>

## 주요 기능 구현 방법

- **계산 기능**

  - `eval()`을 사용할 수 없었기 때문에 계산 알고리즘을 짜기 위해서 계산기 입력사항을 배열에 저장하고 [후위표기법](https://ko.wikipedia.org/wiki/%EC%97%AD%ED%8F%B4%EB%9E%80%EB%93%9C_%ED%91%9C%EA%B8%B0%EB%B2%95)으로 전환환뒤 후위표기법 계산 알고리즘을 사용했습니다
  - 계산기에서는 수식과 계산결과를 따로 보여주고 있으며 수식은 사용자가 입력한 커맨드를 바탕으로 문자열로 나타내고 있습니다
  - **실시간으로 바뀌는 계산결과**는 사용자가 숫자나 연산자를 눌렀을 때 그 전에 입력한 값을 토대로 계산해서 보여주도록 하고 있습니다. 그리고 정보를 계산기 사용스택 `calcStack`에 저장하고 사용자가 **undo**를 했을 때는 가장 최근 정보를 불러와서 보여주고 있습니다
  - **천 단위 구분자**는 전체 수식 문자열에서 **정규표현식**으로 숫자를 찾아서 구분자를 넣어줬습니다
  - **부호전환**은 사용자가 지금 숫자를 입력하고 있다면 부호전환시 그 숫자에 부호전환을 한 값으로 대치하도록 구현하였습니다 숫자를 입력하고 있지않다면 아무 반응도 일어나지 않도록 구현하였습니다
  - **과학적 표기법**은 `toExponential()`메서드를 활용해서 13자리 이상이면 과학적 표기법으로 나타내도록 하였습니다

- **다크 모드**

  - 다크모드 초기 값은 사용자의 **운영체제 다크모드 설정**에 따라 결정되도록 구현했습니다. 이를 위해서 미디어쿼리인 [prefers-color-scheme](https://developer.mozilla.org/ko/docs/Web/CSS/@media/prefers-color-scheme)를 활용했습니다.
  - 사용자가 다크모드 직접 변경 시 전환했던 설정을 그대로 유지하기 위해서 다크모드 설정 값을 `localStroage`에 저장하고 `localStroage`에 저장된 값이 없다면 사용자 운영체제 설정을 따라가도록 설정하였습니다
  - CSS적으로는 html속성의 `data-*`프로퍼티를 활용하여 `document.body.dataset.theme = newTheme;` 코드로 새로운 모드를 dataset 객체 저장한다음 css에서는 `body[data-theme="light"]{...}` `body[data-theme="dark"]{...}` 로 어트리뷰트 셀렉터를 활용하여 모드에 따라 색상이 바뀌도록 했습니다

- **히스토리 기능**
  - 계산 결과 기록을 알 수 있는 히스토리 기능은 사용자가 **등호** 버튼을 클릭했을 때 검색기록을 `localStroage`에 저장하게끔 구현되어있습니다
  - 검색 기록은 초기화 버튼을 눌러서 모두 삭제 할 수 있도록 구현했습니다

<br/>

## 구현하면서 어려웠던 점

- **계산 로직 구현**

  - 후위표기법 개념을 통해서 괄호가 없는 계산 로직은 구현이 쉬웠지만 괄호가 들어있는 계산식을 만들려고 하니 괄호가 있는 경우와 없는 경우에 따라 많은 분기가 생겨서 이 부분을 하나하나 if문으로 작성을 하려니 계산 로직이 꼬이는 경우가 많았습니다
  - 사용자가 올바르지 않은 계산식을 작성할 때 에러처리나 올바르게 작성할 수 있도록 입력제한을 거는 로직을 구현하는 것이 어려웠습니다

    > 예를 들면 다음과 같은 부분을 처리하는 것이 어려웠습니다
    >
    > - 사용자가 괄호옆에 연산자를 배치하지 않았을 때는 곱하기로 처리하기
    > - 한 숫자안에서 소수점 연속 입력시 하나만 입력하도록 하기
    > - 처음 어떠한 숫자도 입력하지 않았을 때 연산자 입력시 0과 연산되도록 하기
    > - 등호버튼을 누르고 결과가 나온 후에 숫자입력시에는 결과창을 초기화 하고 입력되도록 하고 연산자 입력시에는 나온 결과 값과 연산 할 수 있도록하기

- **다크모드 & 히스토리 구현**

  - 다크모드를 구현할 때는 CSS in JS 라이브러리의 ThemeProvider를 많이 활용을 했었는데 이번 프로젝트는 CSS만으로 구현을 해보고 싶어서 css와 html 속성들을 공부하고 적용하는 것이 힘들었습니다
  - 히스토리의 경우는 로직을 구현하는 것은 간단하였지만 히스토리를 자연스러운 드롭다운 방식으로 만들기 위해 부모와 자식 요소간에 `position`속성 값과 `z-index`값을 적절히 배치하는 것이 어려웠습니다
