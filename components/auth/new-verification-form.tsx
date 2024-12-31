'use client';

import { useSearchParams } from 'next/navigation';
import CardWrapper from './card-wrapper';
import { BeatLoader } from 'react-spinners';
import { useCallback, useEffect, useState } from 'react';
import { newVerification } from '@/actions/new-verification';
import FormSuccess from '../form-success';
import FormError from '../form-error';

const NewVerificationForm = () => {
  const [successMsg, setSuccessMsg] = useState<string | undefined>('');
  const [errorMsg, setErrorMsg] = useState<string | undefined>('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = useCallback(() => {
    if (token) {
      newVerification(token)
        .then((result) => {
          if (result.error) {
            setErrorMsg(result.error);
          } else {
            setSuccessMsg(result.success);
          }
        })
        .catch(() => setErrorMsg('Something went wrong'));
    } else {
      setErrorMsg('Missing token');
    }
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [token, onSubmit]);

  return (
    <CardWrapper
      headerLabel='Confirming your verification'
      backButtonLabel='Back to login'
      backButtonHref='/auth/login'>
      <div className='flex w-full items-center justify-center'>
        {!successMsg && !errorMsg && <BeatLoader />}
        <FormSuccess message={successMsg} />
        <FormError message={errorMsg} />
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
