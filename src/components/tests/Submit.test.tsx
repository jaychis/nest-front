import userEvent from "@testing-library/user-event";
import BoardSubmit from "../../pages/Board/BoardSubmit/BoardSubmit";
import { render, screen } from '@testing-library/react';

describe('글 작성 테스트', () => {
    let user: ReturnType<typeof userEvent.setup>

    beforeEach(() => {
        user = userEvent.setup();
        render(
            <BoardSubmit/>
        )})
    
    test(('제목 입력시 정상적으로 적용되는지지'), async() => {
        const titleInput = screen.getByTestId('title-input')
        await user.type(titleInput, '글 작성 제목 ')
        expect(titleInput).toHaveValue('글 작성 제목')
    })
})