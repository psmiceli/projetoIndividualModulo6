import { Table, Container, Button } from 'react-bootstrap'
import ContentsApi from './api/ContentsApi'
import { useEffect, useState } from 'react'
import CreateContentModal from './components/CreateContentModal'
import UpdateContentModal from './components/UpdateContentModal'

function App() {
  const [contents, setContents] = useState()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState()

  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleShowCreateModal = () => setIsCreateModalOpen(true);

  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);
  const handleShowUpdateModal = () => setIsUpdateModalOpen(true);

  useEffect(() => {
    async function getData() {
      await ContentsApi().getContents().then(data => {
        return data.json()
      })
      .then(data => {
        setContents(data)
      })
    }

    getData()
  }, [])

  async function deleteContent(contentId) {
    try {
      await ContentsApi().deleteContent(contentId)

      const formattedContents = contents.filter(cont => {
        if(cont.id !== contentId){
          return cont
        }
      })

      setContents(formattedContents)
    } catch(err) {
      throw err
    }
  }

  async function createContent(event) {
    try {
      event.preventDefault()

      const req = event.currentTarget.elements

      await ContentsApi().createContent(
        req.titulo.value, req.descricao.value, Number(req.porcentagem.value)
      ).then(data => {
        return data.json()
      }).then(res => {
        setContents([...contents, {
          id: res.contentId,
          titulo: req.titulo.value,
          descricao: req.descricao.value,
          porcentagem: Number(req.porcentagem.value)
        }])

        setIsCreateModalOpen(false)
      })
    } catch(err) {
      throw err
    }
  }

  async function updateContent(event) {
    try {
      event.preventDefault()

      const req = event.currentTarget.elements

      await ContentsApi().updateContent(
        selectedContent.id, req.titulo.value, req.descricao.value, Number(req.porcentagem.value)
      )

      const formattedContents = contents.map(cont => {
        if(cont.id === selectedContent.id) {
          return {
            id: selectedContent.id,
            titulo:  req.titulo.value,
            descricao: req.descricao.value,
            porcentagem: Number(req.porcentagem.value)
          }
        }

        return cont
      })

      setContents(formattedContents)

      setIsUpdateModalOpen(false)
    } catch(err) {
      throw err
    }
  }

  return(
    <>
    <Container className='conteudoPrincipal'>
    
      <div className='ContainerBanner'>
        <img src="src/img/logo/svg/logoSVG1horizontal.svg" className="logoBannerIndex"/>
      </div>
      <div className='linha'></div>
      <Button
        className="mb-2"
        onClick={handleShowCreateModal}
        variant='primary'>
        Cadastrar cliente
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Endereço</th>
            <th className="text-center">Plano</th>
            <th className='th-acoes'> </th>
          </tr>
        </thead>

        <tbody>
          {contents && contents.map(cont => (
            <tr key={cont.id}>
              <td className='align-middle'>{cont.titulo}</td>
              <td className='align-middle'>{cont.descricao}</td>
              <td className='align-middle text-center'>{cont.porcentagem}</td>
              <td className='td-acoes align-middle'>
                <Button onClick={() => deleteContent(cont.id)} variant='danger' size="sm">
                  Excluir
                </Button>
                <Button
                  onClick={() => {
                    handleShowUpdateModal()
                    setSelectedContent(cont)
                  }}
                  variant='warning'
                  className='m-1'
                  size="sm"
                  >
                  Atualizar
                </Button>
              </td>

            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
    <CreateContentModal isModalOpen={isCreateModalOpen} handleClose={handleCloseCreateModal} createContent={createContent} />
    {selectedContent && (
      <UpdateContentModal isModalOpen={isUpdateModalOpen} handleClose={handleCloseUpdateModal} updateContent={updateContent} content={selectedContent} />
    )}
    </>
  )
}

export default App
