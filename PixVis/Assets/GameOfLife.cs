// Code is translated from the book(Processing language) 
// <strong>Generative Art</strong> : <em>A practical guide using Processing</em> 
// by <em>Matt Pearson</em>. 
// He owns all the copyrights etc. 
// I just made a C# translation for exercise purposes.
// feel free to try it.


using UnityEngine;
using System.Collections;
using System.Collections.Generic; // added for using List namespace 

public class GameOfLife : MonoBehaviour {

    private Cell[,] _cellArray;
    static int _cellSize = 10;
    public int _numX, _numY;
    private int canvasW = 300;
    private int canvasH = 300;
    private float posScale = .4f;
    public GameObject cellPrefab;
	public List<Tileset> tiles;
	public int tileIndex=0;
	public bool swap=false;

    private Cell cell;
	
	public class Tileset
	{
        public Material stateMat;
        public Material unstateMat;		
		
		public Tileset(string m1, string m2)
		{
            stateMat = Resources.Load(m1, typeof(Material)) as Material;
            unstateMat = Resources.Load(m2, typeof(Material)) as Material;
		}
	}

    public class Cell {

        public float x, y;
        public bool state; 
        public bool nextState; 
        public Transform parentTransform;
        public GameObject cellFab;
        private GameObject cellRef;
        public List<Cell> neighbors;
		public GameOfLife world;

        public Cell (float x, float y, Transform transform, GameObject cellFab, GameOfLife world){

            // class properties should be used 
            // with 'this' to be accesbile from outside

            this.x = x;
            this.y = y;
            this.parentTransform = transform;
            this.cellFab = cellFab;
			this.world=world;

            if (Random.Range(0f,2f) > 1) {
              nextState = true;
            }
            else {
              nextState = false;
            }

            state = nextState;

            neighbors = new List<Cell>();

            Spawn();
            MoveStuff();
        }

        public void Spawn(){
            cellRef = Instantiate(cellFab, parentTransform.position, parentTransform.rotation) as GameObject;
        }

        public void MoveStuff(){
            cellRef.transform.position = new Vector3(this.x, this.y, cellRef.transform.position.z);
            cellRef.transform.parent = parentTransform;
        }

        public void AddNeighbor( Cell cell ){
            neighbors.Add(cell);
        }
		
		public void SetState(bool newState)
		{
			state=newState;
		}

		public void FlipState()
		{
			state=!state;
		}		
		
        public void CalculateNextState(){

            int liveCount = 0;

            for (int i=0; i < neighbors.Count; i++) {
              if (neighbors[i].state == true) { 
                liveCount++;
              }
            }

            if (state == true) {
              if ((liveCount == 2) || (liveCount == 3)) {
                nextState = true;
              }
              else {
                nextState = false;
              }
            }
            else {
              if (liveCount == 3) {
                nextState = true;
              }
              else {
                nextState = false;
              }
            }

            // Vichniac Vote

            // int liveCount = 0;
            //
            // if (state) { 
            //     liveCount++;
            // }
               
            // for (int i=0; i < neighbors.Count; i++) {
            //     if (neighbors[i].state == true) { 
            //         liveCount++;
            //     } 
            // }
               
            // if (liveCount <= 4) { 
            //     nextState = false;
            // } else if (liveCount > 4) { 
            //     nextState = true;
            // }

            // if ((liveCount == 4) || (liveCount == 5)) { 
            //     nextState = !nextState;
            // }

        }

        public void DrawCell (){

            state = nextState;

            if (state == true) {
				if(world.swap)
				{
	                cellRef.renderer.sharedMaterial = world.tiles[world.tileIndex].unstateMat;
				}
				else
				{
	                cellRef.renderer.sharedMaterial = world.tiles[world.tileIndex].stateMat;
				}
            }
            else {
				if(world.swap)
				{
	                cellRef.renderer.sharedMaterial = world.tiles[world.tileIndex].stateMat;
				}
				else
				{
	                cellRef.renderer.sharedMaterial = world.tiles[world.tileIndex].unstateMat;
				}
            }
        }

    } // † End Of Cell Class † //


    // Use this for initialization
    void Start () {		
        _numX = (int)Mathf.Floor(canvasW/_cellSize);
        _numY = (int)Mathf.Floor(canvasH/_cellSize);
		
		tiles=new List<Tileset>();
		tiles.Add(new Tileset("Fire", "Grass"));
		tiles.Add(new Tileset("PinkHex", "PinkTile"));
		tiles.Add(new Tileset("PurpleHex", "PinkTile"));
		tiles.Add(new Tileset("BlueHex", "PinkTile"));
		
        InitGame();
    }

    void InitGame(){

        _cellArray = new Cell [_numX,_numY];

        for(int x=0; x<_numX; x++){
            for(int y=0; y<_numY; y++){

                Transform containerPos = gameObject.transform;
                cell = new Cell(x * .5f, y * .5f, containerPos, cellPrefab, this);
                _cellArray[x,y] = cell;

            }
        }

        for (int x = 0; x < _numX; x++) { 
            for (int y = 0; y < _numY; y++) {

                int above = y-1; 
                int below = y+1; 
                int left = x-1; 
                int right = x+1;

                if (above < 0) { 
                    above = _numY-1;
                } 

                if (below == _numY) { 
                    below = 0;
                } 
                
                if (left < 0) { 
                    left = _numX-1;
                }
                
                if (right == _numX) { 
                    right = 0;
                }

                _cellArray[x,y].AddNeighbor(_cellArray[left,above]);
                _cellArray[x,y].AddNeighbor(_cellArray[left,y]); 
                _cellArray[x,y].AddNeighbor(_cellArray[left,below]); 
                _cellArray[x,y].AddNeighbor(_cellArray[x,below]); 
                _cellArray[x,y].AddNeighbor(_cellArray[right,below]); 
                _cellArray[x,y].AddNeighbor(_cellArray[right,y]); 
                _cellArray[x,y].AddNeighbor(_cellArray[right,above]); 
                _cellArray[x,y].AddNeighbor(_cellArray[x,above]);

            }
        }
    }
	
	void Randomize()
	{
		for (int x=0;x<_numX;x++) { 
            for (int y=0;y<_numY;y++) {
				if (Random.Range(0f,2f) > 1) {
	                _cellArray[x,y].SetState(true);
	            }
	            else {
	                _cellArray[x,y].SetState(false);
	            }								
            }
        }		
	}

	void FlipRandomize()
	{
		for (int x=0;x<_numX;x++) { 
            for (int y=0;y<_numY;y++) {
				if (Random.Range(0f,2f) > 1) {
	                _cellArray[x,y].FlipState();
	            }
            }
        }		
	}	

	void AddRandomize()
	{
		for (int x=0;x<_numX;x++) { 
            for (int y=0;y<_numY;y++) {
				if (Random.Range(0f,2f) > 1) {
	                _cellArray[x,y].SetState(true);
	            }
            }
        }		
	}	

	
    // Update is called once per frame
    void Update () {
		if(Input.GetButtonDown("Jump"))
		{
			Randomize();
		}
//		if(Input.GetButtonDown("Fire1"))
//		{
//			FlipRandomize();
//		}
//		if(Input.GetButtonDown("Fire2"))
//		{
//			AddRandomize();
//		}

		if(Input.GetButtonDown("Fire1"))
		{
			if(tileIndex==tiles.Count-1)
			{
				tileIndex=0;
			}
			else
			{
				tileIndex=tileIndex+1;
			}
		}

		if(Input.GetButtonDown("Fire2"))
		{
			swap=!swap;
		}

		
		for (int x=0;x<_numX;x++) { 
            for (int y=0;y<_numY;y++) {
                _cellArray[x,y].CalculateNextState();
            }
        }

        for (int x=0;x<_numX;x++) { 
            for (int y=0;y<_numY;y++) {
                _cellArray[x,y].DrawCell();
            }
        }
        
    }


}