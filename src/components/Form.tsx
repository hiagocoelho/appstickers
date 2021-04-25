import styled from 'styled-components';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { phoneMask, CEPMask } from '../utils/utils';

const FormContainer = styled.div`
    background-color: white;
    width: 50%;
    min-width: max-content;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
    box-sizing: border-box;
    box-shadow: 4px 3px 3px #111111;

    @media(max-width: 1280px) {
        width: 80%;
    }
`
const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`
const InputBox = styled.div`
    margin: 1rem;
    display: flex;
    flex-direction: column;
`
const Title = styled.div`
    color: white;
    word-wrap: normal;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 80%;
`
const SubTitle = styled.p`
    margin: 0.5rem 1rem;
    color: #303030;
`

interface Inputs {
    name: string;
    email: string;
    phone: string;
    addressZip: string;
    addressState: string;
    addressCity: string;
    addressDistrict: string;
    addressStreet: string;
    addressNumber: number;
    addressComplement?: string;
}

interface AdressResponse {
    erro?: boolean;
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
}

export function Form() {
    const [phone, setPhone] = useState('');
    const [addressZip, setAddressZip] = useState('');
    const [addressState, setAddressState] = useState('');
    const [addressCity, setAddressCity] = useState('');
    const [addressDistrict, setAddressDistrict] = useState('');
    const [addressStreet, setAddressStreet] = useState('');
    const [addressWasNotFound, setAddressWasNotFound] = useState(false);
    const [hasZip, setHasZip] = useState(false);
    const [hasSubmitted, setHasSubmmitted] = useState(false);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

    function onSubmit(formData: Inputs) {

        fetch("https://simple-api-selection.herokuapp.com/submit/", {
            method: 'POST',
            headers: {
                'content-type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                ...formData,
                phone: parseInt(formData.phone.replace(/\D/g, "")),
                addressZip: parseInt(formData.addressZip.replace(/\D/g, ""))
            })
        })
        .then((res) => {
            res.json()
            if (res.status === 200) {
                setHasSubmmitted(true);
            } else if (res.status === 400) {
                throw new Error("Algo deu errado ao preencher os seguintes campos: ");
            } else {
                alert("Erro ao enviar seus dados, por favor tente novamente em alguns minutos.");
            }
        })
    }

    function handleCEP(cep: string) {
        setAddressZip(CEPMask(cep));

        if (cep?.length !== 9) {
            return;
        }

        setHasZip(true);

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then((res) => res.json())
            .then((data: AdressResponse) => {
                if (data.erro) {
                    setAddressWasNotFound(true);
                    return;
                }
                setAddressState(data.uf);
                setAddressCity(data.localidade);
                setAddressDistrict(data.bairro);
                setAddressStreet(data.logradouro);
                setValue("addressState", data.uf);
                setValue("addressCity", data.localidade);
                setValue("addressDistrict", data.bairro);
                setValue("addressStreet", data.logradouro);
                setAddressWasNotFound(false);
            });
    }

    return (
        <>
            {hasSubmitted === false ? (
                <FormContainer>
                <form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                    <SubTitle>Dados pessoais:</SubTitle>
                </Row>
                <Row>
                    <InputBox>
                        <label htmlFor="name">Nome:</label>
                        <input type="text" name="name" id="name" {...register("name", {required: true })}/>
                        {errors.name && <span>This field is required</span>}
                    </InputBox>
                    <InputBox>
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" id="email" {...register("email", {required: true })}/>
                        {errors.email && <span>This field is required</span>}
                    </InputBox>
                    <InputBox>
                        <label htmlFor="phone">Telefone:</label>
                        <input 
                            name="phone" 
                            id="phone" 
                            {...register("phone", {required: true })}
                            value={phone}
                            onChange={(e) => setPhone(phoneMask(e.target.value))}
                        />
                        {errors.phone && <span>This field is required</span>}
                    </InputBox>
                </Row>
                <Row>
                    <SubTitle>Endereço:</SubTitle>
                </Row>
                <Row>
                    <InputBox>
                        <label htmlFor="addressZip">CEP:</label>
                        <input 
                            name="addressZip" 
                            id="addressZip" 
                            {...register("addressZip", { required: true })}
                            value={addressZip}
                            onChange={(e) => handleCEP(e.target.value)}
                        />
                        {errors.addressZip && <span>This field is required</span>}
                    </InputBox>
                    {hasZip === true && (
                    <>
                        <InputBox>
                            <label htmlFor="addressState">Estado:</label>
                            <input 
                                type="text" 
                                name="addressState" 
                                id="addressState" 
                                {...register("addressState", { required: true })}
                                value={addressState}
                                onChange={(e) => setAddressState(e.target.value)}
                                readOnly={!addressWasNotFound}
                            />
                            {errors.addressState && <span>This field is required</span>}
                        </InputBox>
                        <InputBox>
                            <label htmlFor="addressCity">Cidade:</label>
                            <input 
                                type="text" 
                                name="addressCity" 
                                id="addressCity" 
                                {...register("addressCity", {required: true })}
                                value={addressCity}
                                onChange={(e) => setAddressCity(e.target.value)}
                                readOnly={!addressWasNotFound}
                            />
                            {errors.addressCity && <span>This field is required</span>}
                        </InputBox>
                        <InputBox>
                            <label htmlFor="addressDistrict">Bairro:</label>
                            <input 
                                type="text" 
                                name="addressDistrict" 
                                id="addressDistrict" 
                                {...register("addressDistrict", {required: true })}
                                value={addressDistrict}
                                onChange={(e) => setAddressDistrict(e.target.value)}
                                readOnly={!addressWasNotFound}
                            />
                            {errors.addressDistrict && <span>This field is required</span>}
                        </InputBox>
                    </>
                    )}
                </Row>
                <Row>
                {hasZip === true && (
                    <>
                    <InputBox>
                        <label htmlFor="addressStreet">Logradouro:</label>
                        <input 
                            type="text" 
                            name="addressStreet" 
                            id="addressStreet" 
                            {...register("addressStreet", {required: true })}
                            value={addressStreet}
                            onChange={(e) => setAddressStreet(e.target.value)}
                            readOnly={!addressWasNotFound}
                        />
                        {errors.addressStreet && <span>This field is required</span>}
                    </InputBox>
                    <InputBox>
                        <label htmlFor="addressNumber">Número:</label>
                        <input 
                            type="number"
                            name="addressNumber" 
                            id="addressNumber" 
                            {...register("addressNumber", {required: true })}
                        />
                        {errors.addressNumber && <span>This field is required</span>}
                    </InputBox>
                    <InputBox>
                        <label htmlFor="addressComplement">Complemento:</label>
                        <input 
                            type="text" 
                            name="addressComplement" 
                            id="addressComplement" 
                            {...register("addressComplement")}
                        />
                    </InputBox>
                    </>
                    )}
                </Row>
                <Row>
                </Row>
                <Row>
                    <InputBox>
                        <input type="submit" value="Enviar"/>
                    </InputBox>
                </Row>
            </form>
            </FormContainer>
            ) : (
                <Title>
                    Muito bom! Você receberá seus adesivos em alguns dias.
                </Title>
            )}
        </>
    )
}