import { useAuth0 } from "@auth0/auth0-react"
import { FC, useEffect, useState } from "react"
import { Drink } from "../types/types"
import { getDetailedDrinks, getPublicDrinks, insertDrink } from "../utils/ApiMethods"
import { colorNames, colourNameToHex } from "../utils/ColorNameToHex"
import useStore from "../zustandStore/store"
import DrinkComponent from "./DrinkComponent"
import Loader from "./Loader"

const Home: FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>()
  const [role, token] = useStore(state => [state.role, state.token])
  const { isAuthenticated, isLoading } = useAuth0()
  const [detailsOpened, setDetailsOpened] = useState<boolean>(false)
  const [title, setTitle] = useState<string>("")
  const [recipes, setRecipes] = useState<{
    name?: string | undefined
    color: string
    parts: number
  }[]>([])

  const updateDrinks = (): void => {
    getDetailedDrinks(token!)
      .then((res) => {
        setDrinks(res);
      })
  }

  const insertDrink_ = () => {
    insertDrink(token!, title, JSON.stringify(recipes))
    .then(res => {
      if(res){
        alert("added successfully")
        updateDrinks()
        setRecipes([])
        setTitle("")
        setDetailsOpened(false)
      }else{
        alert("an error occured")
      }
    }).catch(err => {
      alert("an error occured")
    })
  }

  const addLiquid = () => {
    setRecipes([...recipes, {name: "empty", color: "#ffffff", parts: 0}])
  }

  const deleteLiquid = () => {
    setRecipes(recipes.slice(0, -1))
  }

  useEffect(() => {
    if (!isLoading) {
      role === "manager" || role == "barista" ? getDetailedDrinks(token!)
        .then((res) => {
          setDrinks(res);
        }) : getPublicDrinks()
          .then((res) => {
            setDrinks(res);
          })
    }
  }, [isLoading])

  return isLoading && !role ? <Loader /> : (
    <div className="flex flex-wrap mx-2 mt-10 items-center gap-6 justify-center">
      {/* add drink button */}
      {isAuthenticated && role === "manager" ? (
        <>
          <div
            onClick={() => setDetailsOpened(true)}
            className="rounded-full border-2 border-black w-12 h-12 flex items-center justify-center text-2xl hover:cursor-pointer hover:border-gray-400">
            <span>+</span>
          </div>

          {/* cover layer */}
          {detailsOpened ? (
            <>
              <div onClick={() => {
                setDetailsOpened(false)
                setRecipes([])
                setTitle("")
              }} className={`bg-black bg-opacity-70 fixed top-0 left-0 w-[100vw] h-[100vh] z-10`} />

              {/* new drink */}
              {/* details div */}
              <div className="flex flex-col justify-between fixed top-20 mx-auto bg-white max-w-[600px] min-h-[300px] py-6 px-2 rounded-md z-20">
                <div className="flex gap-3 pl-2">
                  <h3 className="font-bold font-lg">title : </h3>
                  <input type="text" value={title} onChange={(e) => setTitle(e.currentTarget.value)} />
                </div>
                <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="py-3 px-2">name</th>
                      <th className="py-3 px-2">color</th>
                      <th className="py-3 px-2">parts</th>
                      <th className="w-[30px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipes.map((el, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th className="py-4 px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"><input className="w-[90%]" type="text" value={el.name} onChange={(e) => {
                          const copy = [...recipes]
                          copy[index].name = e.currentTarget.value
                          setRecipes(copy)
                        }} /></th>
                        <td className="py-4 px-2"><input className="w-[90%]" type="color" value={colourNameToHex(el.color as colorNames)} onChange={(e) => {
                          const copy = [...recipes]
                          copy[index].color = e.currentTarget.value
                          setRecipes(copy)
                        }} /></td>
                        <td className="py-4 px-2"><input className="w-[90%]" type="number" value={el.parts} onChange={(e) => {
                          const copy = [...recipes]
                          copy[index].parts = Number(e.currentTarget.value)
                          setRecipes(copy)
                        }} /></td>
                        <td
                          onClick={deleteLiquid}
                          className="text-red-600 font-bold text-lg hover:cursor-pointer">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div
                  className="flex justify-around ">
                  <button
                    onClick={insertDrink_}
                    disabled={recipes.length && title ? false : true}
                    className={`${recipes.length && title ? "hover:bg-green-700 bg-green-500" : "bg-gray-500"}  text-white font-bold py-2 px-4 rounded`}>
                    Insert Drink
                  </button>

                  <button
                    onClick={addLiquid}
                    className="hover:bg-blue-700 bg-blue-500 text-white font-bold py-2 px-4 rounded">
                    Add ingredient
                  </button>
                </div>
              </div>
            </>
          ) : null}

        </>
      ) : null}

      {drinks?.map(drink => <DrinkComponent updateDrinks={updateDrinks} key={drink.id} drink={drink} />)}
    </div>
  )
}

export default Home