import React, { useEffect, useState, ChangeEvent, FormEvent } from "react"
import "./style.css"
import logo from "assets/logo.svg"
import { Link, useHistory } from "react-router-dom"
import { FiArrowLeft } from "react-icons/fi"
import { LeafletMouseEvent } from 'leaflet'
import { Map, TileLayer, Marker } from "react-leaflet"
import api from 'services/api'
import axios from 'axios'
import Item, {ItemProp} from 'components/Items'

interface IBGEUFResponse {
    sigla: string
}
interface IBGECITYResponse {
    nome: string
}

const CreatePoint: React.FC = () => {
    const [items, setItems] = useState<ItemProp[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0])
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })

    const [selectedUf, setSelectedUf] = useState<string>('0')
    const [selectedCity, setSelectedCity] = useState<string>('0')
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0,0])
    const [selectedItems, setSelectedItems] = useState<number[]>([])
    const history = useHistory()

    useEffect(()=>{
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude} = position.coords
            setInitialPosition([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('items').then((response) => setItems(response.data))
    }, [setItems])

    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then((response) => setUfs(response.data.map(uf => uf.sigla)))
    }, [])

    useEffect(() => {
        axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => setCities(response.data.map((city) => city.nome)))
    }, [selectedUf])

    function handleSelectedUf(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedUf(event.target.value)
    }
    function handleSelectedCity(event: ChangeEvent<HTMLSelectElement>) {
        setSelectedCity(event.target.value)
    }
    function handleMapClick(event: LeafletMouseEvent) {
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }
    function handleInputChante(event: ChangeEvent<HTMLInputElement>) {
        const {name, value} = event.target
        setFormData({
            ...formData,
            [name]: value
        })
    }
    function handleSelectedItem(id: number) {
        const alreadySelected = selectedItems.findIndex(item => item === id)
        if(alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id)
            setSelectedItems(filteredItems)
        } else setSelectedItems([...selectedItems, id])
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()

        const { name, email, whatsapp} = formData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectedItems

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }

        await api.post('points', data)
        alert("ponto de coleta cadastrado com sucesso")
        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />\
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>
            <form action="" onSubmit={handleSubmit}>
                <h1>
                    Cadastro do <br /> ponto de coleta
                </h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input onChange={handleInputChante} name="name" id="name" type="text" />
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input onChange={handleInputChante} name="email" id="email" type="text" />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input onChange={handleInputChante} name="whatsapp" id="whatsapp" type="text" />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereços</h2>
                        <span>Seleccione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                value={selectedUf}
                                onChange={handleSelectedUf} 
                                name="uf" 
                                id="uf">
                                <option value="0">Selecione uma UF</option>
                                {ufs.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade </label>
                            <select 
                                name="city" 
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectedCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => <Item key={item.id} item={item} selected={selectedItems} handleClick={handleSelectedItem} /> )}

                    </ul>
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
            </form>
        </div>
    )
}

export default CreatePoint
