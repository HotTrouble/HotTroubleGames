var bullet:Transform;
var speed:float;

function Update () {
	if(Input.GetButtonDown("Jump"))
	{
		var instance=Instantiate(bullet, transform.position, Quaternion.identity);
		instance.rigidbody.AddForce(transform.forward*speed);
	}
}