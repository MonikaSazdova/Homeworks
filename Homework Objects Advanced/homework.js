function Academy(name, students, subjects, start, end){
	this.name = name; 
	this.students = students;
	this.subjects = subjects;
	this.start = start;
	this.end = end;
	this.numberOfClasses = this.subjects.length * 10;
	this.printStudents = function(){
		console.log(this.students);
		};
	this.printSubjects = function(){
		console.log(this.subjects);
		}
}

function Subject(title, isElective, academy, students){
	this.title = title;
	this.isElective = isElective;
	this.academy = academy;
	this.students = students;
	this.numberOfClasses = 10;
	this.overrideClasses = function(num){
		if (num >= 3)
		this.numberOfClasses = num;
	}
}

function Student(firstName, lastName, age){
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
	this.completedSubjects = [];
	this.academy = null;
	this.currentSubject = null;

	this.startAcademy = function(academyObj){
		this.academy = academyObj;
		academyObj.students.push(this)
	}
	
	this.startSubject = function(subjectObj){
		if(this.academy){
			console.log(`The student ${this.firstName} ${this.lastName} studies at ${this.academy.name} Academy.`)
			if(this.academy.subjects.includes(subjectObj)){
				console.log(`The ${subjectObj.title} subject is included in the program of the ${this.academy.name} Academy.`)
				this.currentSubject = subjectObj;
			} else {
				console.log(`ERROR:The ${subjectObj.title} subject is NOT included in the program of the ${this.academy.name} Academy.`)
				}
		} else {
			console.log(`ERROR: The student ${this.firstName} ${this.lastName} is NOT a student at ${this.academy.name} Academy.`)
			}

		if(this.currentSubject)
		this.completedSubjects.push(this)
}
}

let student1 = new Student("Monika", "Sazdova", 26);
let student2 = new Student("Ivan", "Angelovski", 20);
let student3 = new Student("Angela", "Ivanovska", 31)

let webDevelopment = new Academy("SEDC Web Development", [], [], "15th October 2019", "1th October 2020");
let webDesign = new Academy("SEDC Web Design", [], [], "15th October 2019", "1th October 2020");

let html = new Subject("HTML", false, webDevelopment, []);
let css = new Subject("CSS", false, webDevelopment, []);
let photoshop = new Subject('Photoshop', false, webDesign, []);

student1.startAcademy(webDevelopment);
student2.startAcademy(webDevelopment);
student3.startAcademy(webDesign);
webDevelopment.subjects.push(html, css);
webDesign.subjects.push(photoshop);
student3.startSubject(photoshop);
student1.startSubject(html, css);
student2.startSubject(html, css);
webDevelopment.printStudents();
webDevelopment.printSubjects();
webDesign.printStudents();
webDesign.printSubjects();
html.overrideClasses(4);