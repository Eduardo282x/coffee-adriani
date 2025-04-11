import { FromProps } from '@/interfaces/form.interface'
import { FC } from 'react'

export const UsersForm: FC<FromProps> = ({ data, onSubmit }) => {
    console.log(data);
    console.log(onSubmit);
    
    return (
        <div>UsersForm</div>
    )
}
