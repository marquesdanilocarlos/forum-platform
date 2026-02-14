import StudentRegister, {
  StudentRegisterInput,
} from '@/domain/forum/application/use-cases/student-register'
import InMemoryStudentsRepository from './repositories/in-memory-students-repository'
import Hasher from '@/domain/forum/application/cryptography/hasher'
import FakeHasher from './cryptography/fake-hasher'

describe('Teste de cadastro de aluno', () => {
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let fakeHasher: Hasher
  let sut: StudentRegister

  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    sut = new StudentRegister(inMemoryStudentsRepository, fakeHasher)
  })

  it('Deve realizar o cadastro de um aluno', async () => {
    const studentInput: StudentRegisterInput = {
      name: 'Danilo Doe',
      email: 'marquesdanilocarlos@gmail.com',
      password: '123456',
    }

    const { student } = await sut.execute(studentInput)

    expect(student.id.value).toBeDefined()
    expect(student).toEqual(inMemoryStudentsRepository.students[0])
  })

  it('Deve realizar o hash da senha do aluno', async () => {
    const studentInput: StudentRegisterInput = {
      name: 'Danilo Doe',
      email: 'marquesdanilocarlosdoe@gmail.com',
      password: '123456',
    }

    const { student } = await sut.execute(studentInput)
    const hashedPassword = await fakeHasher.hash(studentInput.password)

    expect(student.id.value).toBeDefined()
    expect(inMemoryStudentsRepository.students[0].password).toEqual(
      hashedPassword,
    )
  })
})
