*** Settings ***
Library         RequestsLibrary
Library         Collections
Suite Setup     Create Petstore Session

*** Variables ***
${BASE_URL}     https://petstore.swagger.io/v2
${ALIAS}        petstore

*** Test Cases ***
Create User
    [Documentation]    Create a user with POST /user and verify success.
    [Tags]    api    user    create
    ${username}=    Create Unique Username
    ${user}=    Build User Payload    ${username}    Taylor    Created

    ${response}=    POST On Session    ${ALIAS}    /user    json=${user}

    Should Be Equal As Integers    ${response.status_code}    200

Get User By Username
    [Documentation]    Create a fixture, then retrieve and verify it by username.
    [Tags]    api    user    read
    ${username}=    Create Unique Username
    ${expected}=    Create Pet User    ${username}

    ${response}=    GET On Session    ${ALIAS}    /user/${username}

    Should Be Equal As Integers    ${response.status_code}    200
    ${actual}=    Call Method    ${response}    json
    User Should Match    ${actual}    ${expected}

Update User
    [Documentation]    Create a fixture, update it with PUT, and verify persisted values.
    [Tags]    api    user    update
    ${username}=    Create Unique Username
    ${original}=    Create Pet User    ${username}
    ${updated}=    Build User Payload    ${username}    Jordan    Updated
    Set To Dictionary    ${updated}    id=${original}[id]
    Set To Dictionary    ${updated}    email=updated.${username}@example.com
    Set To Dictionary    ${updated}    phone=555-0102
    Set To Dictionary    ${updated}    userStatus=${2}

    ${put_response}=    PUT On Session    ${ALIAS}    /user/${username}    json=${updated}

    Should Be Equal As Integers    ${put_response.status_code}    200
    ${get_response}=    GET On Session    ${ALIAS}    /user/${username}
    Should Be Equal As Integers    ${get_response.status_code}    200
    ${actual}=    Call Method    ${get_response}    json
    User Should Match    ${actual}    ${updated}
    Should Not Be Equal    ${original}[firstName]    ${actual}[firstName]

*** Keywords ***
Create Petstore Session
    Create Session    ${ALIAS}    ${BASE_URL}    verify=${True}    timeout=15

Create Unique Username
    ${uuid}=    Evaluate    uuid.uuid4().hex    modules=uuid
    RETURN    rf_user_${uuid}

Build User Payload
    [Arguments]    ${username}    ${first_name}    ${last_name}
    ${user_id}=    Evaluate    random.randint(100000000, 2147483647)    modules=random
    ${user}=    Create Dictionary
    ...    id=${user_id}
    ...    username=${username}
    ...    firstName=${first_name}
    ...    lastName=${last_name}
    ...    email=${username}@example.com
    ...    password=demo-password
    ...    phone=555-0101
    ...    userStatus=${1}
    RETURN    ${user}

Create Pet User
    [Arguments]    ${username}
    ${user}=    Build User Payload    ${username}    Taylor    Fixture
    ${response}=    POST On Session    ${ALIAS}    /user    json=${user}
    Should Be Equal As Integers    ${response.status_code}    200
    RETURN    ${user}

User Should Match
    [Arguments]    ${actual}    ${expected}
    ${actual_username}=    Get From Dictionary    ${actual}    username
    ${actual_id}=    Get From Dictionary    ${actual}    id
    ${actual_first_name}=    Get From Dictionary    ${actual}    firstName
    ${actual_last_name}=    Get From Dictionary    ${actual}    lastName
    ${actual_email}=    Get From Dictionary    ${actual}    email
    ${actual_phone}=    Get From Dictionary    ${actual}    phone
    ${actual_status}=    Get From Dictionary    ${actual}    userStatus
    Should Be Equal As Integers    ${actual_id}    ${expected}[id]
    Should Be Equal    ${actual_username}    ${expected}[username]
    Should Be Equal    ${actual_first_name}    ${expected}[firstName]
    Should Be Equal    ${actual_last_name}    ${expected}[lastName]
    Should Be Equal    ${actual_email}    ${expected}[email]
    Should Be Equal    ${actual_phone}    ${expected}[phone]
    Should Be Equal As Integers    ${actual_status}    ${expected}[userStatus]
