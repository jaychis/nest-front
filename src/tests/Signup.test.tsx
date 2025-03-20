import { waitFor } from "@testing-library/react";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signup from '../pages/User/Signup'

describe('Signup 단위 테스트', () => {
    
    let user: ReturnType<typeof userEvent.setup>

    beforeEach(() => {
        user = userEvent.setup();
        render(
        <Signup
        onSwitchView={jest.fn()}
        modalIsOpen={jest.fn()}
        kakaoEmail=""
        />
    )})

    test('이메일 입력시 값이 정상적으로 적용되는지', async() => {
        const emailInput = screen.getByTestId('email-input')
        await user.type(emailInput, 'wjdvlf99@naver.com');
        expect(emailInput).toHaveValue('wjdvlf99@naver.com')
    })

    test('닉네임 입력시 값이 정상적으로 적용되는지', async() => {
        const nicknameInput = screen.getByTestId('nickname-input');
        await user.type(nicknameInput, 'user1');
        expect(nicknameInput).toHaveValue('user1');
    })

    test('패스워드드 입력시 값이 정상적으로 적용되는지', async() => {
        const passwordInput = screen.getByTestId('password-input');
        await user.type(passwordInput, 'testtest8!');
        expect(passwordInput).toHaveValue('testtest8!');
    })

    test('패스워드 확인인 입력시 값이 정상적으로 적용되는지', async() => {
        const confirmPasswordInput = screen.getByTestId('confirmPassword-input');
        await user.type(confirmPasswordInput, 'user1');
        expect(confirmPasswordInput).toHaveValue('user1');
    })

    test('휴대폰 번호 입력시 값이 정상적으로 적용되는지', async() => {
        const phoneNumberInput = screen.getByTestId('phoneNumber-input');
        await user.type(phoneNumberInput, '01056287623')
        expect(phoneNumberInput).toHaveValue('01056287623');
    })

    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

test('모든 값이 입력되지 않았을 때', async () => {
    const phoneNumberInput = screen.getByTestId('phoneNumber-input');
    const confirmPasswordInput = screen.getByTestId('confirmPassword-input');
    const passwordInput = screen.getByTestId('password-input');
    const nicknameInput = screen.getByTestId('nickname-input');
    const emailInput = screen.getByTestId('email-input');
    const submitButton = screen.getByTestId('submit-button');

    // 각 입력 필드에 값 입력
    await user.type(phoneNumberInput, '01012345678');
    await user.type(confirmPasswordInput, 'testtest8!');
    await user.type(passwordInput, 'testtest8!');
    await user.type(nicknameInput, 'nickname123');

    // 이메일 입력 후 비우기
    await user.type(emailInput, 'test@example.com');
    await user.clear(emailInput);
    expect(emailInput).toHaveValue('');

    // 회원가입 버튼 클릭
    await user.click(submitButton);

    // alert 호출 여부 확인
    expect(alertMock).toHaveBeenCalledWith('모든 정보를 입력해주세요');
});
})