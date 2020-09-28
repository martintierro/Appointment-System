*** Settings ***
Library  SeleniumLibrary    run_on_failure=NOTHING

*** Variables ***
${SERVER}         localhost:3000
${BROWSER}        Chrome
${LOGIN URL}      http://${SERVER}/login
${ADMIN URL}    http://${SERVER}/admin
${SECRETARY URL}    http://${SERVER}/secretary
${DENTIST URL}    http://${SERVER}/dentist

*** Keywords ***
Open Admin Browser
    Open Browser    ${ADMIN URL}    ${BROWSER}
    Maximize Browser Window